<template>
  <section>
    <!-- up to sm -->
    <div class="wave d-none d-sm-block"></div>
    <!-- end -->
    <div class="bg-wave"></div>

    <!-- up to md -->
    <div class="m-spaceship d-block d-md-none"></div>
    <div class="m-planet-pink d-block d-md-none"></div>
    <!-- end -->

    <div class="container">
      <div class="bg-stars"></div>

      <div class="spaceship d-none d-md-block"></div>
      <div class="planet-pink d-none d-md-block"></div>

      <div class="logo-container mx-auto mb-5">
        <img
          src="@/assets/images/logos/logo-cosmos-vertical.svg"
          alt="COSMOS"
        />
      </div>

      <div id="mc_embed_signup">
        <form class="subscription-form">
          <input
            id="mce-EMAIL"
            ref="emailInput"
            class="email"
            type="email"
            value
            name="EMAIL"
            :placeholder="getInputPlaceholder()"
            required
          />

          <!-- required by mailchimp -->
          <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
          <div style="position: absolute; left: -5000px;" aria-hidden="true">
            <input
              type="text"
              name="b_b27e8984466b0dc642a917ba5_3f1ff0278f"
              tabindex="-1"
              value
            />
          </div>
          <!-- end -->

          <button
            id="mc-embedded-subscribe"
            class="button button--primary"
            type="submit"
            @click="handleSubscription"
          >
            <div
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            ></div>
            <span v-if="!isLoading">Subscribe</span>
          </button>

          <div id="mce-responses" class="form-messages clear">
            <div
              class="response error"
              :if="errorMsg.length"
              v-html="errorMsg"
            ></div>
            <div
              class="response success"
              :if="successMsg.length"
              v-html="successMsg"
            ></div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import serialize from "form-serialize";
export default {
  data() {
    return {
      windowWidth: undefined,
      errorMsg: "",
      successMsg: "",
      isLoading: false
    };
  },
  beforeMount() {
    this.windowWidth = window.outerWidth;
  },
  methods: {
    getInputPlaceholder() {
      const gridBreakpointSm = 576;
      let placeholder = "";
      if (this.windowWidth <= gridBreakpointSm) {
        placeholder = "Stay tuned";
      } else {
        placeholder = "Stay tunded with conference updates";
      }
      return placeholder;
    },

    async handleSubscription(e) {
      e.preventDefault();

      this.isLoading = true;

      const data = serialize(document.querySelector(".subscription-form"), {
        hash: true, // produces an object, as opposed to a querystring
        empty: true // includes empty values
      });

      const response = await this.$axios.$post("/subscribe", data);
      // clear messages before setting the right one
      this.errorMsg = "";
      this.successMsg = "";

      this[`${response.result}Msg`] = response.message;

      this.isLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
$inputHeight: 50px;
$buttonWidth: 140px;
$buttonWidthSm: 100px;

section {
  background: rgb(16, 6, 56);
  background: linear-gradient(
    180deg,
    rgba(16, 6, 56, 1) 0%,
    rgba(9, 6, 66, 1) 100%
  );
  text-align: center;
  position: relative;

  .bg-wave {
    width: 100%;
    height: 100%;

    background-image: url(~@/assets/images/newsletter-wave.svg);
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: cover;

    position: absolute;

    @media (max-width: grid-breakpoint("xl" )) {
      background-size: contain;
    }

    @media (max-width: grid-breakpoint("md" )) {
      background-image: url(~@/assets/images/newsletter-wave-md.svg);
    }

    z-index: 0;
  }

  .m-planet-pink {
    height: 110px;
    width: 70px;

    background-size: 100px 100px;
    background-repeat: no-repeat;
    background-image: url(~@/assets/images/planet-pink.svg);
    background-position: left;

    position: absolute;
    top: 20px;
    right: 0;
    z-index: 0;
  }

  .m-spaceship {
    height: 190px;
    width: 90px;

    background-size: 129px 190px;
    background-repeat: no-repeat;
    background-image: url(~@/assets/images/spaceship.svg);
    background-position: right;

    position: absolute;
    top: 20px;
    left: 0;
    z-index: 0;
  }

  .container {
    padding: spacer(11) 0;
    position: relative;

    .bg-stars {
      height: 100%;
      width: 100%;

      background-image: url(~@/assets/images/newsletter-stars.svg);
      background-position: bottom center;
      background-repeat: no-repeat;
      background-size: contain;

      position: absolute;
      bottom: 0;
      z-index: 1;
    }

    .planet-pink {
      height: 138px;
      width: 138px;

      background-image: url(~@/assets/images/planet-pink.svg);
      background-repeat: no-repeat;
      background-position: center center;

      position: absolute;
      bottom: 100px;
      right: 40px;
      z-index: 0;
    }

    .spaceship {
      height: 190px;
      width: 160px;

      background-image: url(~@/assets/images/spaceship.svg);
      background-repeat: no-repeat;
      background-position: center center;

      position: absolute;
      top: 20px;
      left: 60px;
      z-index: 0;
    }

    .logo-container {
      width: 198px;
      height: 149px;
    }

    form {
      height: $inputHeight;
      width: 550px;
      max-width: 100%;

      margin: 0 auto;
      position: relative;
      z-index: 3;

      input {
        width: calc(100% - #{$buttonWidth});
        height: $inputHeight;

        background-color: lighten(color("dark"), 3%);
        border: 1px solid lighten(color("secondary"), 10%);
        border-right: none;
        @include border-radius(5px 0 0 5px);
        @include box-shadow(none);
        color: white;
        font-weight: 300;
        font-size: font-size("smaller");
        outline: none;
        letter-spacing: 1px;
        line-height: $inputHeight;

        padding: 5px 20px;
        position: absolute;
        left: 0;

        @media (max-width: grid-breakpoint("sm")) {
          width: calc(100% - #{$buttonWidthSm});
          padding: 3px 10px;
          letter-spacing: 0;
        }

        @include placeholder {
          color: lighten(color("secondary"), 10%);
          font-size: font-size("smallest");
        }
      }

      .button {
        width: $buttonWidth;
        height: $inputHeight;

        @include border-radius(0 5px 5px 0);
        border: 1px solid color("primary");

        position: absolute;
        top: 0;
        right: 0;

        @media (max-width: grid-breakpoint("sm")) {
          width: $buttonWidthSm;
        }

        .spinner-border {
          display: block;
          color: color("dark");
          margin: 0 auto;
        }
      }

      .form-messages {
        width: 100%;
        height: fit-content;

        padding: 10px 5px;
        position: absolute;
        top: 50px;

        .response {
          font-family: "Titillium Web";
          font-weight: 300;
          font-size: 0.85rem;
          text-align: left;

          &.error {
            color: color("danger");
          }

          &.success {
            color: white;
          }
        }
      }
    }
  }
}
</style>
