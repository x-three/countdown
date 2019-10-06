import qs from 'querystring';


export default class Time {
    constructor() {
        this._parseQuery();
    }


    _parseQuery() {
        const query = qs.parse(window.location.search.substring(1));
        this.date = new Date(new Date().getFullYear() + 1, 0).getTime();
        this.showDays = true;

        for (let key in query) {
            switch (key) {
                case 'current':
                    this.current = query.current === 'days';
                    this.showDays = this.current;
                    break;
                case 'forward':
                    this.forward = Date.now();
                    this.showDays = false;
                    break;
                case 'time':
                    let parts = query.time.split(':');
                    const days = +parts[0];
                    const hours = days * 24 + (+parts[1] || 0);
                    const minutes = hours * 60 + (+parts[2] || 0);
                    const seconds = minutes * 60 + (+parts[3] || 0);
                    this.date = new Date(Date.now() + seconds * 1000).getTime();
                    this.showDays = days > 0;
                    break;
                case 'date':
                    parts = query.date.split(':');
                    this.date = new Date(+parts[0], +parts[1] || 0, +parts[2] || 1, +parts[3] || 0, +parts[4] || 0, +parts[5] || 0).getTime();
                    this.showDays = true;
                    break;
            }
        }
    }


    getState() {
        const time = this._getTime();
        return {
            seconds: (~~(time / 1000)) % 60,
            minutes: (~~(time / 1000 / 60)) % 60,
            hours:   (~~(time / 1000 / 60 / 60)) % 24,
            days:    ~~(time / 1000 / 60 / 60 / 24)
        };
    }


    _getTime() {
        const now = new Date();

        if (this.current != null) {
            const newYear = new Date(now.getFullYear(), 0);
            return now.getTime() - newYear.getTime();
        }
        if (this.forward != null) {
            return now - this.forward;
        }
        return this.date - now;
    }
}