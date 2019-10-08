<template>
  <section class="desktop-footer d-none d-md-block">
    <div class="container">
      <div class="terms d-flex">
        <a href="mailto:cosmos@grakn.ai" target="_top">cosmos@grakn.ai</a>
        <a href="./terms" target="_blank">Terms</a>
        <a href="./code-of-conduct" target="_blank">Code of Conduct</a>
      </div>
      <div class="links d-flex">
        <a class="made-by-grakn" href="https://grakn.ai" target="_blank">
          <img
            src="@/assets/images/footer-made-by-grakn.svg"
            alt="Made with Love at Grakn Labs"
          />
        </a>
        <div class="d-flex flex-justify-space-between align-items-center">
          <footer-social-links class="social-links d-flex" />
          <footer-policy />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FooterSocialLinks from "./socialLinks";
import FooterPolicy from "./Policy";

export default {
  components: {
    FooterSocialLinks,
    FooterPolicy
  }
};
</script>

<style lang="scss" scoped>
section {
  a {
    color: white;
    font-weight: 300;
    margin-left: spacer(3);
  }

  .container {
    border-top: 1px solid color("secondary");
    padding: spacer(4) 0;
  }

  .terms {
    align-items: center;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-bottom: spacer(4);

    a {
      font-size: font-size("smallest");
    }
  }

  .links {
    align-items: center;
    justify-content: space-between;

    .made-by-grakn {
      margin-left: 0;
    }

    .social-links {
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: row-reverse;

      a {
        margin-left: spacer(3);
      }
    }
  }
}
</style>
