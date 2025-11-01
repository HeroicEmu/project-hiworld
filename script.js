        /**
         * Function to update the time displayed in the header badge.
         */
        function updateTime() {
            // Get the current date and time
            const now = new Date();

            // Format the time as h:mm AM/PM
            const timeOptions = { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            };
            const timeString = now.toLocaleTimeString('en-US', timeOptions);

            // Construct the final text string
            const fullTimeString = `The time is... ${timeString}!`;

            // Get the element and update its content
            const timeElement = document.getElementById('live-time');
            if (timeElement) {
                timeElement.textContent = fullTimeString;
            }
        }

        // 1. Update the time immediately when the page loads
        updateTime();

        // 2. Set an interval to update the time every 1000 milliseconds (1 second)
        setInterval(updateTime, 1000);