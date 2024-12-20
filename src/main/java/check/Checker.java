package check;


public class Checker {

    public boolean hit(float x, int y, int r) {
        return inRect(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    private boolean inRect(float x, int y, int r) {
        return x <= 0 && y >= 0 && x <= r && y >= -r / 2;
    }

    private boolean inTriangle(float x, int y, int r) {
        return x >= 0 && x <= r && y >= 0 && y <= -x / 2.0 + r / 2.0;
    }

    private boolean inCircle(float x, int y, int r) {
        return x >= 0 && y <= 0 && (x * x + y * y) <= Math.pow(r / 2.0, 2);
    }
}

