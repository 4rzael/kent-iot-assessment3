<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/map'}">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; Coded with
        <i class="fa fa-heart heart"></i> by
        <a href="https://github.com/4rzael" target="_blank">Maxime Agor</a>,
        <a href="https://github.com/SRJanel" target="_blank">Nicolas Giannelos</a>
        and <a href="https://github.com/chekroA" target="_blank">Abdelhalim Chekroun</a>.
      </div>
    </div>
  </footer>
</template>
<script>
  export default {}

</script>
<style>

</style>
