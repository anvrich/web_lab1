package check;


public class Checker {

    public boolean hit(int x, float y, int r) {
        return inRect(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    private boolean inRect(int x, float y, int r) {
        return x <= 0 && y >= 0 && x <= r && y >= -r / 2;
    }

    private boolean inTriangle(int x, float y, int r) {
        return x >= 0 && x <= r && y >= 0 && y <= -x / 2.0 + r / 2.0;
    }

    private boolean inCircle(int x, float y, int r) {
        return x >= 0 && y <= 0 && (x * x + y * y) <= Math.pow(r / 2.0, 2);
    }
}

