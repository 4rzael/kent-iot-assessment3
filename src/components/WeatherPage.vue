<template>
    <div>
        <h1></h1>
        <weather 
            api-key="e3b9aba95a64dc7d97f3d54f2142554c"
            title="Canterbury"
            latitude="51.280233"
            longitude="1.0789088"
            language="en"
            units="uk">
        </weather>
    </div>
</template>

<script>
import VueWeatherWidget from 'vue-weather-widget';
import 'vue-weather-widget/dist/css/vue-weather-widget.css';

export default {
    components: {
        'weather': VueWeatherWidget
    },
}
</script> 