<template>
  <section>
    <mobile-footer class="footer d-block d-md-none"></mobile-footer>
    <desktop-footer class="footer d-none d-md-block"></desktop-footer>
  </section>
</template>

<script>
import MobileFooter from "./Mobile";
import DesktopFooter from "./Desktop";
export default {
  components: {
    MobileFooter,
    DesktopFooter
  }
};
</script>

<style lang="scss" scoped>
.footer {
  background: rgb(15, 9, 67);
  background: linear-gradient(
    180deg,
    rgba(15, 9, 67, 1) 0%,
    rgba(15, 9, 67, 1) 100%
  );
}
</style>
