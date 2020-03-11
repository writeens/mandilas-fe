// Client Side JS
const accountButtons = document.querySelectorAll('[data-sidebar-button]');
const accountViews = document.querySelectorAll('[data-view]');
let currentView = 'account'
accountButtons.forEach((item, outerIndex, arr) => {
    item.addEventListener('click', () => {
        let view = item.getAttribute('data-sidebar-button');
        //Is not current View
        if(view !== currentView){
            //Operations to be performed on other buttons/views
            arr.forEach((item, innerIndex, arr) => {
                if(innerIndex !== outerIndex){
                    // Remove color from other buttons
                    item.style.backgroundColor = ""
                    item.style.color = "#212529"
                    // Hide other views
                    accountViews[innerIndex].style.display = 'none'
                }
            })
            //Operation to be performed on that view and button
            item.style.backgroundColor = "#129347";
            item.style.color = "white";
            accountViews[outerIndex].style.display = 'flex'
            currentView = view
        }
    })
})
// Client Side JS
