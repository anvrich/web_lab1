import check.Checker;
import com.fastcgi.FCGIInterface;
import validation.Validate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Objects;
import java.io.IOException;
import java.util.logging.*;

class Server {
    private static final Logger LOGGER = Logger.getLogger(Server.class.getName());

    static {
        try {
            FileHandler fileHandler = new FileHandler("server.log", true);
            fileHandler.setFormatter(new SimpleFormatter());
            LOGGER.addHandler(fileHandler);
            LOGGER.setLevel(Level.ALL);
        } catch (IOException e) {
            System.err.println("Failed to set up logger: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();
        Validate v = new Validate();
        Checker checker = new Checker();

        while (fcgiInterface.FCGIaccept() >= 0) {
            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
            String query = FCGIInterface.request.params.getProperty("QUERY_STRING");
            if ("GET".equals(method)) {
                long time = System.nanoTime();

                if (!Objects.equals(query, "")) {
                    LinkedHashMap<String, String> m = getValues(query);
                    boolean isShot;
                    boolean isValid;

                    try {
                        isValid = v.check(Float.parseFloat(m.get("x")), Integer.parseInt(m.get("y")), Integer.parseInt(m.get("r")));
                        isShot = checker.hit(Float.parseFloat(m.get("x")), Integer.parseInt(m.get("y")), Integer.parseInt(m.get("r")));
                    } catch (Exception e) {
                        String errorResponse = err("Invalid data");
                        LOGGER.warning("Error processing request: " + errorResponse);
                        System.out.println(errorResponse);
                        continue;
                    }

                    if (isValid) {
                        String response = resp(isShot, m.get("x"), m.get("y"), m.get("r"), time);
                        System.out.println(response);
                    } else {
                        String errorResponse = err(v.getErr());
                        LOGGER.warning("Validation error: " + errorResponse);
                        System.out.println(errorResponse);
                    }
                } else {
                    String errorResponse = err("fill");
                    LOGGER.warning("Empty query string: " + errorResponse);
                    System.out.println(errorResponse);
                }
            } else {
                String errorResponse = err("method");
                LOGGER.warning("Unsupported method: " + errorResponse);
                System.out.println(errorResponse);
            }
        }
    }

    private static LinkedHashMap<String, String> getValues(String inpString) {
        String[] args = inpString.split("&");
        LinkedHashMap<String, String> map = new LinkedHashMap<>();
        for (String s : args) {
            String[] arg = s.split("=");
            map.put(arg[0], arg[1]);
        }
        return map;
    }

    private static String resp(boolean isShoot, String x, String y, String r, long wt) {
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        String workTime = String.format(Locale.US, "%.2f", (double) (System.nanoTime() - wt) / 1_000_000);
        String content = """
            {"x":"%s","y":"%s","r":"%s","result":"%s","workTime":"%s","time":"%s"}
            """.formatted(x, y, r, isShoot, workTime, currentTime);

        return """
            Content-Type: application/json; charset=utf-8
            Content-Length: %d

            %s
            """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }

    private static String err(String msg) {
        String content = """
            {"error":"%s"}
            """.formatted(msg);

        return """
            Content-Type: application/json; charset=utf-8
            Content-Length: %d

            %s
            """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }
}
