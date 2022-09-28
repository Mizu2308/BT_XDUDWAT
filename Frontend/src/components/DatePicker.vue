<template>
    <section>
        <div class="form-group">
            <label>Select a date</label>
            <div class="input-group">
                <flat-pickr
                    v-model="date"
                    :config="config"
                    class="form-control"
                    placeholder="Select date"
                    name="date"/>
                <div class="input-group-append">
                    <button class="btn btn-default" type="button" title="Toggle" data-toggle>
                        <i class="fa fa-calendar">
                            <span aria-hidden="true" class="sr-only">Toggle</span>
                        </i>
                    </button>
                    <button class="btn btn-default" type="button" title="Clear" data-clear>
                        <i class="fa fa-times">
                            <span aria-hidden="true" class="sr-only">Clear</span>
                        </i>
                    </button>
                </div>
            </div>
        </div>
        <pre>Selected date is - {{date}}</pre>
    </section>
</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';

    export default {
        name: 'DatePicker',
        components: {
            flatPickr
        },
        data() {
            return {
                // Initial value can be a date object as well
                date: '2020-10-16',
                // Get more form https://flatpickr.js.org/options/
                config: {
                    wrap: true, // set wrap to true only when using 'input-group'
                    altFormat: 'M j, Y',
                    altInput: true,
                    dateFormat: 'Y-m-d',
                },
            }
        },
    }
</script>