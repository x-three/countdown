import $ from 'jquery';
type TBusy = JQueryDeferred<boolean | undefined>;


/**************************************************************************************************************************************************************/
declare global {
    interface JQuery {
        cssAnimate: (clazz: string, clear?: boolean, cb?: () => void) => this;
        cssAnimateStop: (clear?: boolean) => this;
        cssAnimateDuration: (property?: string, clazz?: string) => number;
    }
}


$.fn.cssAnimate = function(clazz, clear = false, cb?) {
    let completed: number = 0;
    return this.each((i, el) => {
        queue($(el), clazz, clear, () => {
            if (++completed === this.length && cb) cb();
        });
    });
};


$.fn.cssAnimateStop = function(clear?) {
    return this.each((i, el) => {
        stop($(el), clear);
    });
};


$.fn.cssAnimateDuration = function(property?, clazz?) {
    return Math.max(...this.toArray().map(el => getDuration($(el), property, clazz)));
};


/**************************************************************************************************************************************************************/
/**
 * Добавляет CSS анимацию в очередь анимаций jQuery.
 * @param $el   Анимируемый элемент.
 * @param clazz Анимируемый класс. К нему на определённых этапах анимации добавляются суффиксы -from и -active.
 * @param clear Стоит ли убирать класс после окончания анимации.
 * @param cb    Callback, который вызывается после окончания анимации.
 */
function queue($el: JQuery, clazz: string, clear: boolean = false, cb?: () => void): void {
    const completed: TBusy = $.Deferred();
    const from = clazz + '-from',
        active = clazz + '-active';
    
    $el.queue((dequeue) => {
        $el.data('css-animate', completed);
        $el.addClass(from);
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                $el.addClass(`${active} ${clazz}`).removeClass(from);
                setTimeout(() => {
                    completed.resolve();
                }, getDuration($el));
            }, 0);
        });

        completed.done((stopClear) => {
            $el.removeClass(`${from} ${active}`);
            if (stopClear !== undefined ? stopClear : clear) $el.removeClass(clazz);
            $el.removeData('css-animate');
            cb && cb();
            dequeue();
        });
    });
}


/**
 * Прерывает анимацию и опционально убирает анимируемый класс.
 */
function stop($el: JQuery, clear?: boolean): void {
    const busy: TBusy | undefined = $el.data('css-animate');
    if (busy !== undefined) busy.resolve(clear);
}


/**
 * Проверяет наличие CSS анимации (из этого скрипта) в данный момент.
 */
function isAnimated($el: JQuery): boolean {
    return $el.data('css-animate') !== undefined;
}


/**
 * Получение продолжительности transition для конкретного CSS свойства с учётом заданного класса. Если свойство не указано, тогда берётся самое большое значение.
 */
function getDuration($el: JQuery, property?: string, clazz?: string): number {
    clazz && $el.addClass(clazz);

    const properties: string[] = $el.css('transition-property').split(', '),
        durations: number[] = getTimeArray($el, 'transition-duration'),
        delays: number[] = getTimeArray($el, 'transition-delay');

    clazz && $el.removeClass(clazz);

    const summary: number[] = properties.map((el, i) => {
        const du = durations[i % durations.length],
            de = delays[i % delays.length];
        return du === 0 ? 0 : de + du;
    });

    if (property) {
        const index: number = properties.indexOf(property);
        return index === -1 ? 0 : summary[index];
    } else {
        return Math.max(...summary);
    }
}


/**
 * Получение значений времени в миллисекундах для указанного CSS свойства.
 */
function getTimeArray($el: JQuery, property: string): number[] {
    return ($el.css(property) || '0').split(', ').map((value) => {
        return parseFloat(value) * 1000;
    });
}


/**************************************************************************************************************************************************************/
export default { queue, stop, duration: getDuration, is: isAnimated }