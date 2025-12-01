(function () {
    const init = () => {
        initRollingList();
        initScrollSpy();
        initMobileMenu();
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
        const menuLinks = document.querySelectorAll(".nav");
        if (menuLinks.length === 0) return;

        const sections = [...menuLinks]
            .map(link => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        // 스무스 스크롤
        menuLinks.forEach(link => {
            link.addEventListener("click", function (e) {
                const target = document.querySelector(this.getAttribute("href"));
                if (!target) return;

                e.preventDefault();

                const top = target.offsetTop;
                window.scrollTo({
                    top: top,
                    behavior: "smooth"
                });
            });
        });

        // 스크롤 스파이
        window.addEventListener("scroll", () => {
            let scrollPos = window.pageYOffset + 200;

            sections.forEach((sec, index) => {
                const secTop = sec.offsetTop;
                const secBottom = secTop + sec.offsetHeight;

                if (scrollPos >= secTop && scrollPos < secBottom) {
                    menuLinks.forEach(a => a.classList.remove("active"));
                    menuLinks[index].classList.add("active");
                }
            });
        });
    };

    /* -----------------------------------------------------
    * Mobile Menu Toggle
    * ----------------------------------------------------- */
    const initMobileMenu = () => {
        const btn = document.querySelector(".mobile-menu-btn");
        const nav = document.querySelector("header nav");

        if (!btn || !nav) return;

        btn.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    };

    // DOM 로드시 실행
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
