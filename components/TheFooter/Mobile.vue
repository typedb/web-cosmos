<template>
  <section>
    <div class="container">
      <footer-social-links class="social-links d-flex" />
      <div class="policy-container">
        <footer-policy />
      </div>
      <div class="made-by-grakn-container">
        <a href="https://grakn.ai" target="_blank">
          <img
            src="@/assets/images/footer-made-by-grakn.svg"
            alt="Made with Love at Grakn Labs"
          />
        </a>
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
  }

  .container {
    border-top: 1px solid color("secondary");
    padding: spacer(4) 0;
  }

  .social-links {
    width: 250px;

    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row-reverse;
    margin: 0 auto;
    padding-top: spacer(3);

    a {
      margin-left: spacer(3);
    }
  }

  .policy-container {
    font-size: font-size("smallest");
    font-weight: 300;
    text-align: center;

    padding-top: spacer(3) !important;
    margin: 0 auto;
  }

  .made-by-grakn-container {
    width: 226px;
    margin: spacer(3) auto 0 auto;
  }
}
</style>
