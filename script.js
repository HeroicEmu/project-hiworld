        function makeDraggable(element, handle) {
            let newX = 0, newY = 0, startX = 0, startY = 0;
            let isDragging = false;
            
            // Function to handle start of drag (mouse or touch)
            function dragStart(e) {
                // Ensure the event is either a mouse click or a single touch
                if (e.type === 'touchstart' && e.touches.length !== 1) return;

                // Prevent text selection during drag and default touch behavior
                e.preventDefault(); 

                const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

                // --- CRITICAL FIX START: Lock the position before removing 'transform' ---
                // 1. Get the current visual coordinates (which includes the transform)
                const rect = element.getBoundingClientRect();
                
                // 2. Apply those coordinates as absolute pixel values to prevent the jump
                element.style.top = rect.top + 'px';
                element.style.left = rect.left + 'px';

                // 3. Now it is safe to remove the conflicting transform property
                element.style.transform = 'none';
                // --- CRITICAL FIX END ---

                startX = clientX;
                startY = clientY;
                isDragging = true;

                // Add event listeners for moving and ending the drag
                document.addEventListener('mousemove', dragMove);
                document.addEventListener('mouseup', dragEnd);
                document.addEventListener('touchmove', dragMove, { passive: false }); // Use non-passive for touchmove to allow e.preventDefault()
                document.addEventListener('touchend', dragEnd);
                
                // Add a visual cue when dragging starts
                handle.style.cursor = 'grabbing';
            }

            // Function to handle drag movement
            function dragMove(e) {
                if (!isDragging) return;
                
                // Prevent scrolling on touch devices
                if (e.type === 'touchmove') e.preventDefault(); 

                const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

                // Calculate the distance moved since the last frame
                newX = startX - clientX; 
                newY = startY - clientY; 
                
                // Update the starting position for the next move
                startX = clientX;
                startY = clientY;

                // Apply the new position based on the element's current offset
                element.style.top = (element.offsetTop - newY) + 'px';
                element.style.left = (element.offsetLeft - newX) + 'px';
            }

            // Function to handle end of drag
            function dragEnd() {
                if (!isDragging) return;
                isDragging = false;

                // Clean up listeners
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('mouseup', dragEnd);
                document.removeEventListener('touchmove', dragMove);
                document.removeEventListener('touchend', dragEnd);
                
                // Restore visual cue
                handle.style.cursor = 'grab';
            }

            // Attach listeners to the handle element (the title bar)
            handle.addEventListener('mousedown', dragStart);
            handle.addEventListener('touchstart', dragStart);
        }
        
        /**
         * Function to update the time displayed in the header badge.
         */
        function updateTime() {
            const now = new Date();
            const timeOptions = { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            };
            const timeString = now.toLocaleTimeString('en-US', timeOptions);
            const fullTimeString = `The time is... ${timeString}!`;
            const timeElement = document.getElementById('live-time');
            if (timeElement) {
                timeElement.textContent = fullTimeString;
            }
        }

        /**
         * Opens a specific modal window.
         * @param {string} windowId - The ID of the window to open (e.g., 'about').
         */
        function openWindow(windowId) {
            const windowElement = document.getElementById(`window-${windowId}`);
            const navItem = document.getElementById(`nav-${windowId}`);
            
            if (windowElement) {
                // Add active class to show the overlay and animate the window
                windowElement.classList.add('active');
                
                // Add active class to navigation item
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
        }

        /**
         * Closes a specific modal window.
         * @param {string} windowId - The ID of the window to close.
         */
        function closeWindow(windowId) {
            const windowElement = document.getElementById(`window-${windowId}`);
            const navItem = document.getElementById(`nav-${windowId}`);

            if (windowElement) {
                // Remove active class to hide the overlay and reverse animation
                windowElement.classList.remove('active');
                
                // Remove active class from navigation item
                if (navItem) {
                    navItem.classList.remove('active');
                }
            }
        }
        
        /**
         * Handles closing the window when the ESC key is pressed.
         */
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                // Find all active windows and close them
                document.querySelectorAll('.window-overlay.active').forEach(overlay => {
                    // Extract the window ID from the element's ID (e.g., 'window-about' -> 'about')
                    const windowId = overlay.id.replace('window-', '');
                    closeWindow(windowId);
                });
            }
        });

        // =======================================================
        // INITIALIZATION
        // =======================================================
        window.onload = function() {
            // 1. Update the time immediately and set an interval
            updateTime();
            setInterval(updateTime, 1000);
            
            // 2. Make all .window-box elements draggable by their .window-header
            document.querySelectorAll('.window-box').forEach(windowElement => {
                const handleElement = windowElement.querySelector('.window-header');
                if (handleElement) {
                    makeDraggable(windowElement, handleElement);
                }
            });
        };