//Handle Logo Scroll
const handleLogoScroll = () =>{
    let viewWidth = window.innerWidth
    if(viewWidth >= 1350){
        $(document).ready(function(){
            $('.home-logos').slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows:false
            });
        });
    } else if(viewWidth > 850 && viewWidth < 1350){
        $(document).ready(function(){
            $('.home-logos').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows:false
            });
        });
    } else{
        $(document).ready(function(){
            $('.home-logos').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows:false
            });
        });
    }
}

// On Load
const handleHomePageLoad = () => {
    // loader.classList.add('showLoader')
    handleLogoScroll()
    // handleNavbarLoad
    //     .then(user => {
    //         // loader.classList.remove('showLoader')
    //     })
}
window.addEventListener('load', handleHomePageLoad)

window.addEventListener('resize', handleLogoScroll)