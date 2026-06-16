(function () {
    const init = () => {
        AOS.init();
        initRollingList();
        initScrollSpy();
        initHeaderFixed();
        initMobileMenu();
        initSwiper();
    };

    /* -----------------------------------------------------
     * Rolling List 기능
     * ----------------------------------------------------- */
    const initRollingList = () => {
        const list = document.querySelector(".rolling-list");
        const liHeight = 88;

        if (!list) return;

        setInterval(() => {
            const items = list.querySelectorAll("li");
            if (items.length < 5) return;

            const firstItem = items[0];
            const middleItems = Array.from(items).slice(1, 4);
            const lastItem = items[4];

            // 초기화
            items.forEach(item => item.classList.remove("out", "active", "in"));

            // 클래스 부여
            firstItem.classList.add("out");
            middleItems.forEach(item => item.classList.add("active"));
            lastItem.classList.add("in");

            // 위로 이동
            items.forEach(item => {
                item.style.transform = `translateY(-${liHeight}px)`;
            });

            // 재배치
            setTimeout(() => {
                items.forEach(item => {
                    item.style.transition = "none";
                    item.style.transform = "";
                });

                list.appendChild(firstItem);

                // 리플로우 후 transition 다시 활성화
                void list.offsetWidth;

                items.forEach(item => {
                    item.style.transition =
                        "transform 0.85s ease, opacity 1.5s ease, filter 1.5s ease";
                });
            }, 850);
        }, 2500);
    };

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
    const initMobileMenu = () => {
        const btn = document.querySelector(".mobile-menu-btn");
        const nav = document.querySelector("header .nav-box");

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
            spaceBetween: 30,
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

    // DOM 로드시 실행
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
