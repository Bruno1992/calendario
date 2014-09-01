
/*
 * jQuery calendario - v1.0.0
 *
 * @author Antério vieira <anteriovieira@gmail.com>
 */
;(function($) {

    var Calendario = function(element, options){
        this.element = $(element);
        this.options = $.extend({}, $.fn.calendario.defaults, options);
        this.dataInicial;
        this.dataFinal;
        this.show();
    };

    Calendario.prototype = {
        constructor: Calendario,
        show: function ()
        {
            var $this = this;
            $this.dataInicial = this.element.datepicker({
                format: $this.options.format
            })
                .on('focus', function(ev) {

                    var name  = $(this).prop('name');
                    var refe  = $('[data-' + $this.options.dataEnd + '=' + name + ']');

                    if (refe.data('datepicker') !== undefined && refe.data('datepicker') !== null) {
                        $.extend(true, $(this).data('datepicker'), {
                            onRender: function(date) {
                                return date.valueOf() <= refe.data('datepicker').date.valueOf() ? 'disabled' : '';
                            }
                        });
                        $(this).data('datepicker').update();
                    }
                })
                .on('changeDate', function(ev){

                    var novaDate = new Date(ev.date);
                    var refeData = $('#' + $(this).data($this.options.dataEnd));

                    if(refeData.length){
                        novaDate.setDate(novaDate.getDate() + $this.options.sumEnd);
                        $this.anexarDataFinal(refeData);
                        $this.dataFinal.setValue(novaDate);
                        refeData.focus();
                    }
                    $this.dataInicial.hide();

                })
                .bind($this.options.block.join(' '), function(e){
                    e.preventDefault();
                })
                .data('datepicker');
        },
        anexarDataFinal: function (refeData)
        {
            var $this = this;
            $this.dataFinal = $(refeData)
                .off('changeDate')
                .on('changeDate', function(evt){
                    $this.dataFinal.hide();
                })
                .bind($this.options.block.join(' '), function(e){
                    e.preventDefault();
                })
                .data('datepicker');

            $.extend(true, $this.dataFinal, {
                onRender: function(date){
                    return date.valueOf() <= $this.dataInicial.date.valueOf() ? 'disabled' : '';
                }});


        },
        remove: function(){

            var datepicker = this.element.data('datepicker');
            if(datepicker){
                datepicker.picker.remove();
                delete this.element.data().datepicker;
                this.element.off(this.options.block.join(' '));
            }

        }

    };

    $.fn.calendario = function(option, val ) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('calendario'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('calendario', new Calendario(this, options));
            }

            if (typeof option === 'string') data[option](val);

        });
    };

    $.fn.calendario.defaults = {
        format:  'dd/mm/yyyy',
        dataEnd: 'final',
        block:   ['paste','cut', 'keydown'],
        sumEnd:  1
    };

    $.fn.calendario.Constructor = Calendario;

})(jQuery);

