
/*
 * jQuery calendario - v1.0.0
 *
 * @author Antério vieira <anteriovieira@gmail.com>
 */
;(function($) {

    // Construtor
    var Calendario = function(element, options){
        // Elemento input
        this.element   = $(element);
        // Mescla opções default com as passada por parametro
        this.options   = $.extend({}, $.fn.calendario.defaults, options);
        // Data inicial
        this.startDate = {};
        // Data final
        this.endDate   = {};
        // Exibe calendário
        this.show();
    };

    Calendario.prototype = {
        constructor: Calendario,
        show: function ()
        {
            var $this = this;
            $this.startDate = this.element.datepicker(
                $this.options
            )
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
                    $this.attachEndDate(refeData);
                    $this.endDate.setValue(novaDate);
                    refeData.focus();
                }
                $this.startDate.hide();

            })
            .bind($this.options.block.join(' '), function(e){
                e.preventDefault();
            })
            .data('datepicker');
        },
        attachEndDate: function (refeData)
        {
            var $this = this;
            $this.endDate = $(refeData)
                .off('changeDate')
                .on('changeDate', function(evt){
                    $this.endDate.hide();
                })
                .bind($this.options.block.join(' '), function(e){
                    e.preventDefault();
                })
                .data('datepicker');

            $.extend(true, $this.endDate, {
                onRender: function(date){
                    return date.valueOf() <= $this.startDate.date.valueOf() ? 'disabled' : '';
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

