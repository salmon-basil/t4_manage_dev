// Timer.js
// タイマー機能のコントローラー
//担当　深谷

class TimerController {
    constructor() {
        this.startTime = null;
        this.elapsed = 0;//経過時間
        this.timerId = null;
    }

    start() {
        if (!this.timerId) {
            this.startTime = Date.now();
            this.timerId = setInterval(() => {
                this.elapsed = Date.now() - this.startTime;
            }, 1000);
        }
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
            this.elapsed = Date.now() - this.startTime;
        }
    }

    reset() {
        this.stop();
        this.elapsed = 0;
        this.startTime = null;
    }

    getElapsedSeconds() {
        return Math.floor(this.elapsed / 1000);
    }
}

export default TimerController;
