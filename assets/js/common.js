(function () {
    const header = document.querySelector('.header');
    const slide = document.getElementById('fontSlide');
    const slideWrap = document.querySelector('.font-slide-wrap');
    const secAbout = document.querySelector('.sec-about');

    const SCROLL_THRESHOLD = 10; // ✅ 이 값을 원하는 px로 조절

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        const aboutRect = secAbout.getBoundingClientRect();

        if (scrollY >= SCROLL_THRESHOLD) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }

        // 아래 코드는 기존 유지
        if (aboutRect.top <= 0) {
            header.classList.add('style');
            slideWrap.classList.add('fixed');
        } else {
            header.classList.remove('style');
            slideWrap.classList.remove('fixed');
        }
    }

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
        handleScroll(); // 페이지 로드 시 바로 상태 반영
        fillSlideWithClones();
    });
    window.addEventListener('resize', fillSlideWithClones);
})();