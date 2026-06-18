(function () {
    const init = () => {
        AOS.init();
        initRollingList();
        initScrollSpy();
        initHeaderFixed();
        initHeaderMenu();
        initSwiper();
        initKeyword();
    };

    /* -----------------------------------------------------
     * Rolling List 기능
     * ----------------------------------------------------- */
    const initRollingList = () => {
        const list = document.querySelector(".rolling-list");
        if (!list) return;
    
        const liHeight = list.querySelector("li").offsetHeight + 5;
    
        let isAnimating = false;
    
        const roll = () => {
            if (isAnimating) return;
            isAnimating = true;
    
            const items = Array.from(list.querySelectorAll("li"));
    
            const first = items[0];
            const visible = items.slice(0, 5); // 🔥 항상 4개
    
            // 초기화
            items.forEach(el => el.classList.remove("active", "in", "out"));
    
            // 👉 핵심: 4개 무조건 active
            visible.forEach(el => el.classList.add("active"));
    
            // 👉 첫 번째만 out
            first.classList.add("out");
    
            // 👉 4번째만 in (하지만 active 유지)
            visible[4].classList.add("in");
    
            // 이동
            list.style.transition = "transform 0.5s ease";
            list.style.transform = `translateY(-${liHeight}px)`;
    
            list.addEventListener("transitionend", function handler() {
                list.removeEventListener("transitionend", handler);
    
                list.appendChild(first);
    
                list.style.transition = "none";
                list.style.transform = "translateY(0)";
    
                list.offsetHeight;
    
                isAnimating = false;
            }, { once: true });
        };
    
        // 초기 세팅 (🔥 중요)
        const items = list.querySelectorAll("li");
    
        items.forEach((el, i) => {
            if (i < 4) el.classList.add("active");
        });
    
        items[3].classList.add("in");
    
        list.style.transition = "none";
        list.style.transform = "translateY(0)";
    
        setInterval(roll, 2500);
    };
    
    // const initRollingList = () => {
    //     const list = document.querySelector(".rolling-list");
    //     const liHeight = 88;

    //     if (!list) return;

    //     setInterval(() => {
    //         const items = list.querySelectorAll("li");
    //         if (items.length < 5) return;

    //         const firstItem = items[0];
    //         const middleItems = Array.from(items).slice(1, 4);
    //         const lastItem = items[4];

    //         // 초기화
    //         items.forEach(item => item.classList.remove("out", "active", "in"));

    //         // 클래스 부여
    //         firstItem.classList.add("out");
    //         middleItems.forEach(item => item.classList.add("active"));
    //         lastItem.classList.add("in");

    //         // 위로 이동
    //         items.forEach(item => {
    //             item.style.transform = `translateY(-${liHeight}px)`;
    //         });

    //         // 재배치
    //         setTimeout(() => {
    //             items.forEach(item => {
    //                 item.style.transition = "none";
    //                 item.style.transform = "";
    //             });

    //             list.appendChild(firstItem);

    //             // 리플로우 후 transition 다시 활성화
    //             void list.offsetWidth;

    //             items.forEach(item => {
    //                 item.style.transition =
    //                     "transform 0.85s ease, opacity 1.5s ease, filter 1.5s ease";
    //             });
    //         }, 850);
    //     }, 2500);
    // };

    /* -----------------------------------------------------
     * Smooth Scroll + Scroll Spy
     * ----------------------------------------------------- */
    const initScrollSpy = () => {
        const menuLinks = document.querySelectorAll("nav .nav a");
        if (!menuLinks.length) return;
        const sections = [...menuLinks]
            .map(link => {
                const href = link.getAttribute("href");
                if (!href?.startsWith("#")) return null;
                return document.querySelector(href);
            })
            .filter(Boolean);
    
        const getHeaderOffset = () => {
            const header = document.querySelector(".header");
            return header ? header.offsetHeight : 0;
        };
    
        // 클릭 스크롤
        menuLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (!href?.startsWith("#")) return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;
                window.scrollTo({
                    top: target.offsetTop - getHeaderOffset(),
                    behavior: "smooth"
                });
            });
        });
    
        // active 처리
        const activateMenu = () => {
            const triggerPoint = getHeaderOffset() + 40;
            let currentSection = "";
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (
                    rect.top <= triggerPoint &&
                    rect.bottom >= triggerPoint
                ) {
                    currentSection = section.id;
                }
            });
    
            menuLinks.forEach(link => {
                link.classList.remove("active");
                if (
                    link.getAttribute("href") === `#${currentSection}`
                ) {
                    link.classList.add("active");
                }
            });
        };
    
        window.addEventListener("scroll", activateMenu);
        activateMenu();
    };

     /* -----------------------------------------------------
     * Header Fixed Active Toggle
     * ----------------------------------------------------- */
     const initHeaderFixed = () => {
        const header = document.querySelector("header .header");
        if (!header) return;

        window.addEventListener("scroll", () => {
            if (window.scrollY > 0) {
                header.classList.add("fixed");
            } else {
                header.classList.remove("fixed");
            }
        });
    };

    /* -----------------------------------------------------
    * Mobile Menu Toggle
    * ----------------------------------------------------- */
    const initHeaderMenu = () => {
        const btn = document.querySelector(".menu-btn");
        const nav = document.querySelector(".header");

        if (!btn || !nav) return;

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.toggle("active");
            btn.classList.toggle("active");
        });
    
        document.addEventListener("click", (e) => {
            if (!nav.contains(e.target) && !btn.contains(e.target)) {
                nav.classList.remove("active");
                btn.classList.remove("active");
            }
        });
    };

    const initSwiper = () => {
        const swiperEl = document.querySelector(".mySwiper");
    
        if (!swiperEl || typeof Swiper === "undefined") return;
    
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            // spaceBetween: 0,
            loop: true,
        
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    };

    const initKeyword = () => {
        console.log('initKeyword start');
        const section = document.querySelector('.section-keyword');
        const leftText = section.querySelector('.keyword-left');
        const rightText = section.querySelector('.keyword-right');
    
        if (!section || !leftText || !rightText) {
            console.log('keyword element not found');
            return;
        }
    
        console.log('keyword init');
    
        window.addEventListener('scroll', () => {
            console.log('scroll');
    
            const rect = section.getBoundingClientRect();
            const progress = Math.max(
                0,
                Math.min(
                    1,
                    (window.innerHeight - rect.top) /
                    (window.innerHeight + rect.height)
                )
            );
    
            leftText.style.transform =
                `translateX(${(-500 + progress * 1000)}px)`;
    
            rightText.style.transform =
                `translateX(${(500 - progress * 1000)}px)`;
        });
    };

    // DOM 로드시 실행
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
