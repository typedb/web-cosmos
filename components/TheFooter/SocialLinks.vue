<template>
  <div class="social-links">
    <a href="https://www.linkedin.com/groups/13657731/" target="_blank">
      <img src="@/assets/images/icons/social-linked-in.svg" />
    </a>
    <a href="https://www.facebook.com/pg/graknlabs/community/" target="_blank">
      <img src="@/assets/images/icons/social-facebook.svg" />
    </a>
    <a href="https://twitter.com/graknlabs" target="_blank">
      <img src="@/assets/images/icons/social-twitter.svg" />
    </a>
    <a href="https://grakn.ai/slack" target="_blank">
      <img src="@/assets/images/icons/social-slack.svg" />
    </a>
    <a href="https://github.com/graknlabs" target="_blank">
      <img src="@/assets/images/icons/social-github.svg" />
    </a>
  </div>
</template>

<script>
export default {
  name: "FooterSocialLinks"
};
</script>

<style lang="scss" scoped>
.social-links {
  padding-right: spacer(4);

  a {
    margin-left: spacer(3);
  }
}
</style>
