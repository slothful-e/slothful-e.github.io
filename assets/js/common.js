(function () {
    const header = document.querySelector('.header');
    const pageTitle = document.querySelector('.page-title');
    const slide = document.getElementById('fontSlide');
    const slideWrap = document.querySelector('.font-slide-wrap');
    const secAbout = document.querySelector('.sec-about');

    // 스크롤에 따라 header 및 font-slide-wrap 제어
    function handleScroll() {
        const titleRect = pageTitle.getBoundingClientRect();
        const aboutRect = secAbout.getBoundingClientRect();

        // 헤더 노출
        if (titleRect.top <= 0) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }

        // 슬라이드 고정
        if (aboutRect.top <= 0) {
            header.classList.add('style');
            slideWrap.classList.add('fixed');
        } else {
            header.classList.remove('style');
            slideWrap.classList.remove('fixed');
        }
    }

    // 텍스트 자동 복제
    function fillSlideWithClones() {
        if (!slide || !slideWrap) return;

        const wrapperWidth = slideWrap.offsetWidth;
        const textWidth = slide.offsetWidth;
        const baseText = slide.dataset.text || slide.textContent.trim();
        const repeatCount = Math.ceil(wrapperWidth * 2 / textWidth);

        let newText = '';
        for (let i = 0; i < repeatCount; i++) {
            newText += baseText + '\u00A0\u00A0';
        }
        slide.textContent = newText;
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('DOMContentLoaded', () => {
        handleScroll();
        fillSlideWithClones();
    });
    window.addEventListener('resize', fillSlideWithClones);
})();