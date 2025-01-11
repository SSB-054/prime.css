import './base.scss';
const prime = {}

// refresh all the UI elements
prime.refresh = () => {
    const bSelector = (query, flag, callback) => {
        return document.querySelectorAll(`${query}:not([${flag}])`).forEach(el => {
            callback(el);
            console.log('processing', el);
            el.setAttribute(flag, 'true');
        })
    }
    // tab
    bSelector('.tabs', 'tab-control-binding', (tabs) => {
        tabs.querySelectorAll('.labels>div').forEach(tab => {
            // tab class fix
            tab.addEventListener('click', () => {
                tabs.querySelectorAll('.labels>div.active').forEach(e => e.classList.remove('active'));
                tab.classList.add('active');
                tabs.querySelectorAll('.container.active').forEach(e => e.classList.remove('active'));
                const containerSelector = tab.getAttribute('tab');
                if (containerSelector) {
                    tabs.querySelectorAll(containerSelector).forEach(e => e.classList.add('active'));
                }
            })
        })
    })

    // modal
    bSelector('button[toggle-modal]', 'modal-control-binding', (btn) => {
        btn.addEventListener('click', () => {
            const containerSelector = btn.getAttribute('toggle-modal');
            if (containerSelector) {
                document.querySelector(containerSelector).showModal()
            }
        })
    })
    // auto-hide
    bSelector('[control-hide]', 'hide-control-binding', (element) => {
        const hideTime = parseInt(element.getAttribute('control-hide'), 10);
        setTimeout(() => {
            element.classList.add('smooth-hide');
        }, hideTime * 1000);
    })

    // image preview
    bSelector('img[preview-src]', 'zoomin-control-binding', (element) => {
        element.addEventListener('click', () => {
            const previewSrc = element.getAttribute('preview-src');
            if (previewSrc) {
                const tmpElement = document.createElement('div')
                tmpElement.classList.add('zoom-in-box-preview-modal')
                tmpElement.innerHTML = `<img src="${previewSrc}" alt="${element.getAttribute('alt', 'Unable to load')}">`
                tmpElement.addEventListener('click', () => {
                    tmpElement.remove()
                })
                document.body.appendChild(tmpElement);
            }
        })
    })

    document.querySelectorAll("[popovertarget]").forEach(target => {
        const popoverId = target.getAttribute('popovertarget')
        if (popoverId) {
            const identifier = `#${popoverId}[popover] li`
            const popoverMenu = document.getElementById(popoverId)
            // popover close
            document.querySelectorAll(identifier).forEach(li => {
                li.addEventListener('click', () => {
                    popoverMenu.hidePopover();
                })
            })
            window.addEventListener('scroll', () => {
                popoverMenu.hidePopover();
            });

            // Additional scrolling event handlers for mobile/touch devices
            window.addEventListener('touchmove', () => {
                popoverMenu.hidePopover();
            });

            target.addEventListener('click', (e) => {

                // Get click coordinates relative to the viewport
                let adjustedX = e.clientX;
                let adjustedY = e.clientY;
                // Get viewport dimensions
                const viewportWidth = window.innerWidth - 20;
                const viewportHeight = window.innerHeight - 20;

                // temporarily show the popover to get its dimensions
                const originalDisplay = popoverMenu.style.display;
                popoverMenu.style.left = '-9999px';
                popoverMenu.style.top = '-9999px';
                popoverMenu.style.display = 'block';
                const popoverMenubbox = popoverMenu.getBoundingClientRect();
                popoverMenu.style.display = originalDisplay;

                const popoverWidth = popoverMenubbox.width;
                const popoverHeight = popoverMenubbox.height;
                // adjust the position if the popover would be cut off
                if (e.clientX + popoverWidth > viewportWidth) {
                    adjustedX = viewportWidth - popoverWidth;
                }
                if (e.clientY + popoverHeight > viewportHeight) {
                    adjustedY = viewportHeight - popoverHeight;
                }

                // Position the popover at the click coordinates
                popoverMenu.style.left = `${adjustedX}px`;
                popoverMenu.style.top = `${adjustedY}px`;
            });


        }
    })

}
prime.onready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

(function () {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'prime-toast-container';
    const toastContainerStyle = document.createElement('style');
    const infoIconSvg = '<svg style="color: var(--blue-600);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>';
    const checkIconSvg = '<svg style="color: var(--green-600);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';    
    const errorIconSvg = '<svg style="color: var(--red-600);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>';
    const warningIconSvg = '<svg style="color: var(--yellow-600);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>';
    toastContainerStyle.innerHTML = `
    #prime-toast-container {
        position: fixed;
        top: 20px;
        right: 80px;
        z-index: 1000;
        font-size: 16px;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        gap: 1rem;
        background-color: transparent;
    }
    #prime-toast-container div{
        padding: 0.8rem 1rem;
        font-family: system-ui, -apple-system, sans-serif;
        min-width: 200px;
        max-width: 300px;
        text-wrap: auto;
        line-height: 1.3;
        background-color: var(--surface-section);
        position: relative;
    }
    @media screen and (max-width: 768px) {
        #prime-toast-container {
            top: 10px;
            right: 10px;
            width: 90vw;
            align-items: center;
            gap: 0.55rem;
        }
        
    }`;
    document.head.appendChild(toastContainerStyle);
    document.body.appendChild(toastContainer);
    prime.showToast = (message, type = 'info', config) => {
        let defaultConfig = {
            duration: 5000,
            autohide: true,
            additionalClasses: '',
            additionalStyles: ''
        };
        if (config) {
            defaultConfig = { ...defaultConfig, ...config };
        }
        const toast = document.createElement('div');
        let innerHTML = '';
        toast.className = 'border-round shadow-1 font-semibold cursor-pointer ' + defaultConfig.additionalClasses;
        // Add styles
        toast.style.cssText = `animation: scalein 0.5s, fadeout 0.5s ${defaultConfig.duration / 1000 - 0.5}s;` + defaultConfig.additionalStyles;

        // Set background color based on type
        switch (type) {
            case 'success':
                innerHTML += checkIconSvg;
                break;
            case 'error':
                innerHTML += errorIconSvg;
                break;
            case 'warning':
                innerHTML += warningIconSvg;
                break;
            default:
                innerHTML += infoIconSvg;

        }
        innerHTML += `<p class="m-1 p-0">${message}</p>`
        innerHTML += '<span class="hover:cursor-pointer hover:surface-50 p-1 border-round" style="position: absolute;right:4px;top:4px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>';
        toast.innerHTML = innerHTML 
        toast.addEventListener('click', () => {
            try{
                toastContainer.removeChild(toast);
            }catch(e){
            }
        });
        // Add to DOM
        toastContainer.appendChild(toast);
        if (defaultConfig.autohide) {
            // Remove after defaultConfig.duration
            setTimeout(() => {
                try{
                    toastContainer.removeChild(toast);
                }catch(e){
                }
            }, defaultConfig.duration);
        }
    }
})();



prime.onready(() => {
    prime.refresh();
})

// Expose the function to the global scope
window.prime = prime;