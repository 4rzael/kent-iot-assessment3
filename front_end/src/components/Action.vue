<template>
  <div>
    <h4>{{element.name}}</h4>
    <div class="col-xs-12" style="width: 260px">{{element.values.msg}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Action',
    props: ['element']
  }
</script>
