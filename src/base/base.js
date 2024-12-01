import './base.scss';

window.refreshUI = () => {
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
document.addEventListener('DOMContentLoaded', () => {
    window.refreshUI();
})