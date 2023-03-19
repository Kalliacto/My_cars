(function () {
    const header = document.querySelector('.header');

    window.onscroll = () => {
        if (window.pageYOffset > 50) {
            header.classList.add('header_scroll');
        }
        if (window.pageYOffset === 0) {
            header.classList.remove('header_scroll');
        }
    }
}());

// Burger
(function () {
    const burger = document.querySelector('.burger');
    const headerMenu = document.querySelector('.header__menu');
    const burgerClose = document.querySelector('.header__burger-close');
    const menuLinks = document.querySelectorAll('.header__menu-list');

    burger.addEventListener('click', () => {
        headerMenu.classList.add('header__menu_active');
    })
    burgerClose.addEventListener('click', () => {
        headerMenu.classList.remove('header__menu_active');
    })
    if (window.innerWidth <= 720) {
        for (let link of menuLinks) {
            link.addEventListener('click', () => {
                headerMenu.classList.remove('header__menu_active'); 
                // console.log(link);
            })
        }
    }
}());

// Scroll to anchors
(function () {

    const smoothScroll = function (targetEl, duration) {
        const headerElHeight =  document.querySelector('.header').clientHeight;
        let target = document.querySelector(targetEl);
        let targetPosition = target.getBoundingClientRect().top - headerElHeight;
        let startPosition = window.pageYOffset;
        let startTime = null;
    
        const ease = function(t,b,c,d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
    
        const animation = function(currentTime){
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, targetPosition, duration);
            window.scrollTo(0,run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);

    };

    const scrollTo = function () {
        const links = document.querySelectorAll('.js-scroll');
        links.forEach(each => {
            each.addEventListener('click', function () {
                const currentTarget = this.getAttribute('href');
                smoothScroll(currentTarget, 1000);
            });
        });
    };
    scrollTo();
}());

// Menu link active
(function () {
    document.querySelectorAll('.header__menu-list > li').forEach((n, i, a) => {
        n.addEventListener('click', () => a.forEach(m => m.classList.toggle('is-active', m === n)));
    });

}());

(function () {
    const animItems = document.querySelectorAll('.anim_items');

    if (animItems.length > 0) {
        window.addEventListener('scroll', animationOnScroll);

        function animationOnScroll() {
            for(let i = 0 ; i < animItems.length; i++) {
                const animItem = animItems[i];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;

                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }

                if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('_active');
                } else {
                    animItem.classList.remove('_active');
                }
            }
        }

        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft}
        }
        animationOnScroll();
    }
}());


// Form
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);
    
    async function formSend (e) {
        e.preventDefault();

        let error = formValidate(form);

        let formData = new FormData(form);
        formData.append('image', formImage.files[0]);

        if (error === 0) {
            form.classList.add('sending');
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';
                form.reset();
                form.classList.remove('sending');
            } else {
                alert('Error');
                form.classList.remove('sending');
            }
        } else {
            alert('Заполните все обязательные поля или проверьте правильность заполнения полей!');
        }
    }

    function formValidate(form) {
        let error = 0;
        let formCheck = document.querySelectorAll('._check');

        for (let i = 0; i < formCheck.length; i++) {
            const input = formCheck[i];
            formRemoveError(input);
            
            if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
                input.parentElement.classList.add('error');
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }   
            } 
            if (input.getAttribute('type') === 'tel') {
                let re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
                if (!re.test(input.value)) {
                    console.log('Номер телефона введен неправильно!');
                    formAddError(input);
                    error++;
                }
            }
        }

        return error;
    }

    function formAddError (input) {
        input.classList.add('error');
    };
    function formRemoveError (input) {
        input.parentElement.classList.remove('error');
        input.classList.remove('error');
    };

    //Получение превью
    const formImage = document.getElementById('formImage');
    const formPreview = document.getElementById('formPreview');

    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    })

    function uploadFile(file) {
        if (!['image/jpeg' , 'image/png', 'image/gif'].includes(file.type)) {
            alert('Разрешены только изображения.');
            formImage.value = '';
            return;
        }

        // if (file.size > 2 * 1024 * 1024) {
        //     alert('Файл должен быть не менее 2 МБ.');
        //     return;
        // }

        const reader = new FileReader();
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
        };
        reader.onerror = function (e) {
            alert('Error');
        }
        reader.readAsDataURL(file);
    }
});
