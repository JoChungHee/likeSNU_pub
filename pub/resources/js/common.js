$(document).ready(function(){
    /* 공통 서브페이지 검색 */
    $(".search-input").on("input", function () {
        $(this).siblings(".input-del").toggleClass("active", $(this).val().length > 0);
    });

    /* 공통 서브페이지 검색 텍스트 지우기 */
    $(".input-del").on("click", function () {
        $(this).siblings(".search-input").val("").trigger("input");
    });

    /* 공통 페이징 */
    $(".page-number").click(function(){
        $(this).addClass('active');
        $(".page-number").not(this).removeClass('active');
    });

    // 26.01.12 추가됨
    var scrollPosition = 0;




    /* 함수 초기 실행 */
    progressBar();
    relevantBage();

    //26.01.08 초기 실행 추가
    selectSet();
});

// 공통 프로그레스 바 진행도
function progressBar(){
    $(".progress").each(function(){
        var progressVal = $(this).find('.bar-box').data("value");

        $(this).find(".bar").css("width", progressVal + "%");
        $(this).find(".percent").text(progressVal + "%");
    });
}

// 리스트 페이지 공통 관련도
function relevantBage(){
    $(".data-bage").each(function(){
        var thisVal = $(this).data('value');

        $(this).find('.data-val').text(thisVal);

        if( thisVal >= '90' ){
            $(this).addClass('green-bage');
            $(this).find('.data-txt').text('매우높음');
        }else{
            $(this).addClass('blue-bage');
            $(this).find('.data-txt').text('높음');
        }

    });
}

//26.01.08 추가 됨
//서브 페이지 컨텐츠 텝 공통
function contentsTab(){
    $(".cont-tab-form").each(function () {
        var $wrap = $(this);
        var activeTab = $wrap.find(".tab-item.active").data("tab");

        $wrap.find(".cont-box").hide();
        $wrap.find('.cont-box[data-name="' + activeTab + '"]').show();
    });

    $(document).on("click", ".cont-tab-form .tab-item", function () {
        var $this = $(this);
        var tabName = $this.data("tab");
        var $wrap = $this.closest(".cont-tab-form");

        // tab active 처리
        $wrap.find(".tab-item").removeClass("active");
        $this.addClass("active");

        // contents 처리
        $wrap.find(".cont-box").hide();
        $wrap.find('.cont-box[data-name="' + tabName + '"]').show();
    });
}

//26.01.08 추가됨
//26.01.12 수정됨
//수정내용 - 기존 = 클릭시에만 / 수정 = 기본적으로 active 텍스트 불러옴
//공통 select box
function selectSet(){
    $(".select-form").each(function () {
        var $selectForm = $(this);
        var $activeOption = $selectForm.find(".option.active");

        if ($activeOption.length) {
            $selectForm.find(".choice-box").text($activeOption.text());
        }
    });

    $(document).on("click", ".select-form .choice-box", function (e) {
        e.stopPropagation();

        var $selectForm = $(this).closest(".select-form");
        var $currentList = $selectForm.find(".select-list");

        $(".select-list").not($currentList).slideUp(200);
        $currentList.stop(true, true).slideToggle(200);
    });

    $(document).on("click", ".select-form .option", function (e) {
        e.stopPropagation();

        var $option = $(this);
        var $selectForm = $option.closest(".select-form");
        var text = $option.text();

        $selectForm.find(".option").removeClass("active");
        $option.addClass("active");

        $selectForm.find(".choice-box").text(text);
        $selectForm.find(".select-list").slideUp(200);
    });

    // select-form 외부 클릭 시 닫기
    $(document).on("click", function () {
        $(".select-list").slideUp(200);
    });
}

//26.01.12 추가됨
// 리포트 페이지 lnb 설정
function reportLnbSet(){
    var scrollSpeed = 600;

    var $window = $(window);
    var $lnb = $(".lnb-form");
    var $header = $("header");
    var $footer = $("footer");

    var offsetTop = 60;
    var offsetBottom = 60;

    var menuActiveText = "";


    setTimeout(function () {
        var menuActiveText = $(".lnb-menu.active:first, .lnb-title.active a").text().trim();
        $(".lnb-active-title").text(menuActiveText);
    }, 1);

    /* =====================
       메뉴 클릭
    ===================== */
    $(document).on("click", ".lnb-menu", function (e) {
        var target = $(this).data("target");
        var page = $(this).data("page");
        var currentPage = location.pathname.split("/").pop();

        if (currentPage === page) {
            e.preventDefault();
            moveToSection(target);
        }
    });

    /* =====================
       페이지 진입 시 hash 처리
    ===================== */
    $(window).on("load", function () {
        var hash = location.hash.replace("#", "");
        if (hash) {
            moveToSection(hash, false);
        }
        updateLnbPosition(); // 최초 위치 계산
    });

    /* =====================
       스크롤 이벤트
    ===================== */
    $(window).on("scroll", function () {
        setActiveByScroll();
        updateLnbPosition();
    });

    $(window).on("resize", function () {
        updateLnbPosition();
    });

    /* =====================
       섹션 이동
    ===================== */
    function moveToSection(target, animate = true) {
        var $section = $('.report-section[data-section="' + target + '"]');
        if (!$section.length) return;

        var offsetTopVal = $section.offset().top;

        if (animate) {
            $("html, body").stop().animate(
                { scrollTop: offsetTopVal },
                scrollSpeed,
                "swing"
            );
        } else {
            $("html, body").scrollTop(offsetTopVal);
        }
    }

    /* =====================
       active 클래스 처리
    ===================== */
    function setActiveMenu(target) {
        var menuActiveText = $(".lnb-menu.active:first, .lnb-title.active a:first").text();
        
        $(".lnb-menu").removeClass("active");
        $('.lnb-menu[data-target="' + target + '"]').addClass("active");

        
        $(".lnb-active-title").text(menuActiveText);
    }

    /* =====================
       스크롤 위치 기준 active 변경
    ===================== */
    function setActiveByScroll() {
        var scrollTop = $(window).scrollTop() + 5;

        $(".report-section").each(function () {
            var $section = $(this);
            var top = $section.offset().top;
            var bottom = top + $section.outerHeight();
            var name = $section.data("section");

            if (scrollTop >= top && scrollTop < bottom) {
                setActiveMenu(name);
                return false;
            }
        });
    }

    /* =====================
       LNB 따라다니기 + header/footer 처리
    ===================== */
    function updateLnbPosition() {
        if (!$lnb.length) return;

        var scrollTop = $window.scrollTop();
        var windowHeight = $window.height();

        var headerBottom = $header.offset().top + $header.outerHeight();
        var footerTop = $footer.offset().top;

        var lnbHeight = $lnb.outerHeight();

        /* header 영역 */
        if (scrollTop + offsetTop <= headerBottom) {
            $lnb.css({
                position: "absolute",
                top: "1.875rem",
                bottom: "auto"
            });
        }
        /* footer 영역 */
        else if (scrollTop + lnbHeight + offsetBottom >= footerTop) {
            $lnb.css({
                position: "absolute",
                top: "auto",
                bottom: "1.875rem"
            });
        }
        /* 일반 스크롤 */
        else {
            $lnb.css({
                position: "fixed",
                top: "1.875rem",
                bottom: "auto"
            });
        }
    }

    /* =====================
       MO Menu 처리
    ===================== */
    function moMenuSet(){
        var $lnbForm = $(".lnb-form");
        var $moBtn = $lnbForm.find(".lnb-mo");
        var $lnbBox = $lnbForm.find(".lnb-box");
        var $activeTitle = $lnbForm.find(".lnb-active-title");

        // MO 상태인지 체크 (display:flex)
        function isMo() {
            return $moBtn.css("display") === "flex";
        }

        // active 메뉴 텍스트 세팅
        function setActiveTitle() {
            var activeText = $lnbForm.find(".lnb-menu.active").text();
            $activeTitle.text(activeText);
        }

        // 초기 세팅
        setActiveTitle();

        // MO 버튼 클릭
        $moBtn.on("click", function () {
            if (!isMo()) return;

            $lnbBox.stop().slideToggle(300);
            $lnbForm.toggleClass("open");
        });

        // 메뉴 클릭 시 (MO일 때 닫기)
        $lnbForm.on("click", ".lnb-menu", function () {
            if (!isMo()) return;

            var text = $(this).text();
            $activeTitle.text(text);

            $lnbBox.stop().slideUp(300);
            $lnbForm.removeClass("open");
        });

        // 리사이즈 시 처리
        $(window).on("resize", function () {
            if (!isMo()) {
                $lnbBox.show();
            } else {
                $lnbBox.hide();
                setActiveTitle();
            }
        });
    }

    moMenuSet();
}

//26.01.12 추가됨
//팝업 제어
//공통 팝업 close
function layerClose(){
    $(".layer-pop").fadeOut();
    popCloseScroll();
}

//팝업 오픈시 스크롤 제어
function popOpenScroll(){
    scrollPosition = $(window).scrollTop();

    $("body").css({
        position: "fixed",
        top: -scrollPosition + "px",
        width: "100%",
        overflow: "hidden"
    });

}

//팝업 종료 스크롤 제어
function popCloseScroll(){
    $("body").css({
        position: "",
        top: "",
        width: "",
        overflow: ""
    });

    $(window).scrollTop(scrollPosition);
}

//26.01.12 추가됨
//필터 btn 클릭시 active 처리
function filterBtnSet(){
    $(document).on("click", ".filter-box .filter-btn", function () {
        var $filterBox = $(this).closest(".filter-box");
        $filterBox.find(".filter-btn").removeClass("active");
        $(this).addClass("active");
    });
}

// 필터 텝
function filterTabSet(){
    $(document).on("click", ".filter-tab-con", function () {
        var $tab = $(this);
        var value = $tab.data("value");

        var $wrap = $tab.closest(".report-filter-form");

        $wrap.find(".filter-tab-con").removeClass("active");
        $tab.addClass("active");

        $wrap.find(".report-tab-con").hide();
        $wrap.find('.report-tab-con[data-box="' + value + '"]').show();
    });
}

function initReportTabs() {
    $(".report-filter-form").each(function () {
        var $wrap = $(this);

        var $activeTab = $wrap.find(".filter-tab-con.active");

        if ($activeTab.length === 0) {
            $activeTab = $wrap.find(".filter-tab-con").eq(0).addClass("active");
        }

        var value = $activeTab.data("value");

        $wrap.find(".report-tab-con").hide();
        $wrap.find('.report-tab-con[data-box="' + value + '"]').show();
    });
}

//26.01.12 추가됨
//페이지 텝 내부 작업
function viewTabSet() {
    $(".view-tab-form.tab-box-type").each(function () {
        var $tabWrap = $(this);
        var $tabBox = $tabWrap.find(".tab-box");
        var $contentWrap = $tabWrap.siblings(".view-tab-box");

        $tabBox.find(".tab-cont").on("click", function () {
            var value = $(this).data("value");

            $tabBox.find(".tab-con").removeClass("active");
            $(this).closest(".tab-con").addClass("active");

            $contentWrap.find(".view-tab-con").hide();
            $contentWrap.find('.view-tab-con[data-page="' + value + '"]').show();
        });

        var initValue = $tabBox.find(".tab-con.active .tab-cont").data("value");
        if (initValue) {
            $contentWrap.find(".view-tab-con").hide();
            $contentWrap.find('.view-tab-con[data-page="' + initValue + '"]').show();
        }
    });

}






