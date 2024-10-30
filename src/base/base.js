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
        element.addEventListener('click', ()=>{
            const previewSrc = element.getAttribute('preview-src');
            if(previewSrc){
                const tmpElement = document.createElement('div')
                tmpElement.classList.add('zoom-in-box-preview-modal')
                tmpElement.innerHTML = `<img src="${previewSrc}" alt="${element.getAttribute('alt', 'Unable to load')}">`
                tmpElement.addEventListener('click', ()=>{
                    tmpElement.remove()
                })
                document.body.appendChild(tmpElement);
            }
        })
    })
}
document.addEventListener('DOMContentLoaded', () => {
    window.refreshUI();
})