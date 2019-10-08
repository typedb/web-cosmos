<template>
  <header ref="header" :class="{ expanded: isMobileNavExpanded }">
    <div class="menu container d-flex">
      <div class="menu-logo-container d-inline">
        <a href="./" class="d-inline-block text-decoration-none">
          <img
            class="logo d-lg-inline-block d-none"
            src="@/assets/images/logos/logo-cosmos-horizontal.svg"
            alt="COSMOS"
          />
          <!-- up to lg -->
          <img
            class="logo d-inline-block d-lg-none"
            src="@/assets/images/logos/logo-cosmos-icononly.svg"
            width="47"
            height="42"
            alt="COSMOS"
          />
          <!-- end -->
        </a>
      </div>

      <!-- up to md -->
      <button
        :class="{
          'hamburger hamburger--collapse d-md-none d-block': true,
          'is-active': isMobileNavExpanded
        }"
        type="button"
        @click="toggleMibileNav"
      >
        <span class="hamburger-box">
          <span class="hamburger-inner" />
        </span>
      </button>
      <!-- end -->

      <nav id="nav" class="menu-nav d-md-flex d-none" role="navigation">
        <ul class="d-flex">
          <a href="#apply" data-scroll-to="apply">
            <li>Apply</li>
          </a>
          <a href="/speakers">
            <li>Speakers</li>
          </a>
          <a href="/sessions">
            <li>Sessions</li>
          </a>
          <a href="#venue" data-scroll-to="venue">
            <li>Venue</li>
          </a>
          <a href="#partners" data-scroll-to="partners">
            <li>Partners</li>
          </a>
          <li class="action">
            <div
              id="eventbrite-widget-modal-trigger-58504110369"
              class="button button--primary"
            >
              Get Tickets
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMobileNavExpanded: false
    };
  },

  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {
      const headerEl = this.$refs.header;
      const windowScrollPos = window.pageYOffset;
      if (windowScrollPos > 500) {
        headerEl.classList.add("with-background");
      } else {
        headerEl.classList.remove("with-background");
      }
    },

    toggleMibileNav() {
      this.isMobileNavExpanded = !this.isMobileNavExpanded;
    }
  }
};
</script>

<style lang="scss" scopped>
@import "@/assets/styles/vendors/hamburger.css";

$headerHeight: 90px;
$navWidth: 710px;
$navLinkColor: white;
$mobileBurgerColor: white;
$navLinkColor__active: color("primary");
$navActionBtnHeight: 40px;
$navActionBtnWidth: 140px;

header {
  height: $headerHeight;
  width: 100%;

  position: fixed;
  z-index: 10;

  .menu {
    height: 100%;
    justify-content: space-between;
    align-items: center;

    &-logo-container {
      display: inline-block;
      position: relative;
    }

    .hamburger {
      cursor: pointer;
      padding: 0;

      &-box {
        width: 33px;
        height: 31px;
      }

      &-inner {
        width: 35px;
        background-color: $mobileBurgerColor !important;

        &:before,
        &:after {
          width: 35px;
          background-color: $mobileBurgerColor !important;
        }
      }
    }
  }

  .menu-nav {
    width: $navWidth;

    justify-content: center;
    align-items: center;

    ul {
      width: 100%;

      list-style: none;
      text-align: center;

      align-items: center;
      justify-content: space-between;
      margin: auto 0;

      a {
        color: $navLinkColor;

        &.active {
          color: $navLinkColor__active;
          text-decoration: none;
        }

        li {
          font-size: font-size("smaller");
        }
      }

      li.action .button {
        height: $navActionBtnHeight;
        width: $navActionBtnWidth;

        line-height: $navActionBtnHeight;
        font-size: font-size("smaller");
      }
    }
  }

  &.with-background {
    background-color: color("dark");
  }

  &.expanded {
    height: auto;
    width: 100%;

    background-color: color("dark");

    display: block !important;

    .menu {
      display: block !important;
      margin: 0 auto;
      // TODO: we should align menu items dynamically, rather than hardcoding padding values
      padding: 24px 15px 20px 15px;
    }

    .hamburger {
      padding-top: 2px;
      float: right;
    }

    nav {
      width: 100% !important;
      display: block !important;

      ul {
        width: 100%;
        max-width: 100%;

        text-align: left;

        display: block !important;
        margin: 0;
        padding-top: 40px;
        padding-left: 0px;

        li {
          border-top: 1px solid lighten(color("dark"), 10%);
          padding: 15px 0;
        }

        li.action {
          padding-top: 30px;

          .button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
