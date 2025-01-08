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
    }
    @media screen and (max-width: 768px) {
        #prime-toast-container {
            top: 10px;
            right: 10px;
            width: 90vw;
            align-items: center;
            gap: 0.55rem;
        }
        
    }

    `;
    document.head.appendChild(toastContainerStyle);
    document.body.appendChild(toastContainer);
    prime.showToast = (innerHTML, type = 'info', config) => {
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
        toast.innerHTML = innerHTML;
        toast.className = 'border-round shadow-2 font-semibold cursor-pointer ' + defaultConfig.additionalClasses;
        // Add styles
        toast.style.cssText = `animation: scalein 0.5s, fadeout 0.5s ${defaultConfig.duration / 1000 - 0.5}s;` + defaultConfig.additionalStyles;

        // Set background color based on type
        switch (type) {
            case 'success':
                toast.style.backgroundColor = 'var(--green-100)';
                toast.style.color = 'var(--green-700)';
                toast.style.border = '1px solid var(--green-200)';
                break;
            case 'error':
                toast.style.backgroundColor = 'var(--red-100)';
                toast.style.color = 'var(--red-700)';
                toast.style.border = '1px solid var(--red-200)';
                break;
            case 'warning':
                toast.style.backgroundColor = 'var(--yellow-100)';
                toast.style.color = 'var(--yellow-700)';
                toast.style.border = '1px solid var(--yellow-200)';
                break;
            default:
                toast.style.backgroundColor = 'var(--gray-100)';
                toast.style.color = 'var(--gray-700)';
                toast.style.border = '1px solid var(--gray-200)';

        }
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