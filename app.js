class TimeKeeper {
    constructor() {
        this.isRunning = false;
        this.startTime = null;
        this.elapsedSeconds = 0;
        this.meetingDuration = 50; // minutes
        this.timerInterval = null;
        this.hasStarted = false; // Track if timer has ever been started
        this.audioReady = false; // Track if audio has been primed
        
        this.elapsedTimeEl = document.getElementById('elapsedTime');
        this.remainingTimeEl = document.getElementById('remainingTime');
        this.progressFillEl = document.getElementById('progressFill');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.statusBar = document.getElementById('statusBar');
        this.durationInput = document.getElementById('durationInput');
        this.progressLabelEl = document.querySelector('.progress-container .time-label');
        
        // Create audio element for notification sound
        this.notificationSound = new Audio('alarm.mp3');
        this.notificationSound.preload = 'auto';
        
        // Set initial title without emoji (favicon provides the hourglass)
        document.title = 'Time Keeper - shobeira.com';
        
        this.updateDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle Enter key in duration input
        this.durationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.updateDuration();
            }
        });

        // Handle window focus/blur for accurate timing
        window.addEventListener('focus', () => {
            if (this.isRunning) {
                this.updateDisplay();
            }
        });
    }

    formatTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDuration() {
        const newDuration = parseInt(this.durationInput.value);
        if (newDuration > 0 && newDuration <= 480) {
            this.meetingDuration = newDuration;
            if (!this.isRunning) {
                this.updateDisplay();
            }
            this.updateStatus(`Meeting duration set to ${newDuration} minutes`);
        } else {
            alert('Duration must be between 1 and 480 minutes');
            this.durationInput.value = this.meetingDuration;
        }
    }

    // Prime audio for Firefox on first user interaction
    primeAudio() {
        if (!this.audioReady) {
            this.notificationSound.play().then(() => {
                this.notificationSound.pause();
                this.notificationSound.currentTime = 0;
                this.audioReady = true;
            }).catch(error => {
                console.log('Audio priming failed:', error);
            });
        }
    }

    toggleTimer() {
        if (!this.isRunning) {
            this.startTimer();
        } else {
            this.stopTimer();
        }
    }

    startTimer() {
        // Prime audio on first user interaction
        this.primeAudio();
        
        this.isRunning = true;
        this.hasStarted = true;
        this.startTime = Date.now() - (this.elapsedSeconds * 1000);
        this.startStopBtn.textContent = 'Pause Timer';
        this.startStopBtn.className = 'btn-primary';
        this.updateStatus('Timer running...', 'running');
        
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 50); // Update more frequently for smoother display
    }

    stopTimer() {
        this.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.startStopBtn.textContent = this.hasStarted ? 'Resume Timer' : 'Start Timer';
        this.startStopBtn.className = 'btn-primary';
        this.updateStatus('Timer paused', 'stopped');
        
        // Update title when paused - emoji AFTER time
        if (this.hasStarted) {
            const meetingSeconds = this.meetingDuration * 60;
            const elapsedSecondsFloored = Math.floor(this.elapsedSeconds);
            const remainingSeconds = Math.max(0, meetingSeconds - elapsedSecondsFloored);
            const remainingStr = this.formatTime(remainingSeconds);
            document.title = `${remainingStr} ⏸️`;
        }
    }

    resetTimer() {
        const wasRunning = this.isRunning;
        if (this.isRunning) {
            this.stopTimer();
        }
        
        this.elapsedSeconds = 0;
        this.startTime = null;
        this.hasStarted = false;
        this.startStopBtn.textContent = 'Start Timer';
        this.updateDisplay();
        this.updateStatus('Timer reset');
        
        // Restore title to initial state without emoji (favicon provides hourglass)
        document.title = 'Time Keeper - shobeira.com';
    }

    addFiveMinutes() {
        this.meetingDuration += 5;
        this.durationInput.value = this.meetingDuration;
        this.updateStatus('Added 5 minutes to meeting duration');
        if (!this.isRunning) {
            this.updateDisplay();
        }
    }

    updateTimer() {
        if (!this.isRunning) return;
        
        const currentTime = Date.now();
        this.elapsedSeconds = (currentTime - this.startTime) / 1000;
        this.updateDisplay();
        
        // Check if meeting time is up
        const meetingSeconds = this.meetingDuration * 60;
        if (this.elapsedSeconds >= meetingSeconds) {
            this.meetingTimeUp();
        }
    }

    updateDisplay() {
        // Calculate meeting duration in seconds
        const meetingSeconds = this.meetingDuration * 60;
        
        // Get elapsed seconds (floored for display)
        const elapsedSecondsFloored = Math.floor(this.elapsedSeconds);
        
        // Calculate remaining seconds ensuring it matches elapsed
        const remainingSeconds = Math.max(0, meetingSeconds - elapsedSecondsFloored);
        
        // Format both times
        const elapsedStr = this.formatTime(elapsedSecondsFloored);
        const remainingStr = this.formatTime(remainingSeconds);
        
        // Update displays
        this.elapsedTimeEl.textContent = elapsedStr;
        this.remainingTimeEl.textContent = remainingStr;
        
        // Update browser tab title - emoji AFTER time when running
        if (this.isRunning) {
            document.title = `${remainingStr} ⏱️`;
        }
        // Note: When paused, title is set in stopTimer()
        // When reset, title is set in resetTimer()
        
        // Update progress bar
        let progressPercent = 0;
        if (meetingSeconds > 0) {
            progressPercent = Math.min(100, (elapsedSecondsFloored / meetingSeconds) * 100);
        }
        this.progressFillEl.style.width = `${progressPercent}%`;
        
        // Update progress percentage label
        this.progressLabelEl.textContent = `Progress: ${Math.floor(progressPercent)}%`;
        
        // Update colours based on remaining time
        this.remainingTimeEl.className = 'time-value time-remaining';
        this.progressFillEl.className = 'progress-fill';
        
        if (remainingSeconds <= 300) { // 5 minutes or less
            this.progressFillEl.classList.add('critical');
        } else if (remainingSeconds <= 600) { // 10 minutes or less
            this.progressFillEl.classList.add('warning');
        }
    }

    meetingTimeUp() {
        this.stopTimer();
        this.updateStatus('Meeting time reached!', 'complete');
        
        // Update title to show time's up
        document.title = 'Time\'s Up! ⏰';
        
        // Play notification sound
        this.notificationSound.currentTime = 0; // Reset to beginning
        this.notificationSound.play().catch(error => {
            console.log('Could not play notification sound:', error);
        });
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Time\'s Up!', {
                body: `Your ${this.meetingDuration}-minute meeting time has elapsed!`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>'
            });
        } else {
            alert(`Time's Up!\n\nYour ${this.meetingDuration}-minute meeting time has elapsed!`);
        }
    }

    updateStatus(message, type = '') {
        this.statusBar.textContent = message;
        this.statusBar.className = 'status-bar';
        if (type) {
            this.statusBar.classList.add(`status-${type}`);
        }
    }
}

// Global functions for button onclick handlers
let timeKeeper;

function updateDuration() {
    timeKeeper.updateDuration();
}

function toggleTimer() {
    timeKeeper.toggleTimer();
}

function resetTimer() {
    timeKeeper.resetTimer();
}

function addFiveMinutes() {
    timeKeeper.addFiveMinutes();
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    timeKeeper = new TimeKeeper();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
