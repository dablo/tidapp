export class Tidrapport {
    constructor(kollega, period) {
        this.kollega = kollega;
        this.period = period;
        this.projektTider = [];
        this.vabDagar = [];
        this.sjukDagar = [];
        this.semesterDagar = [];
    }

    addTid(tid) {
        this.projektTider.push(tid);
    }

    removeTid(tid) {
        //var index = this.projektTider.findIndex(x => Object.is(x, tid));
        var index = this.projektTider.findIndex(x => x.projekt === tid.projekt && x.kund === tid.kund && x.timmar === tid.timmar && x.timpris === tid.timpris);

        if (index !== -1)
            this.projektTider.splice(index);
    }
    addVab(dag) {
        this.vabDagar.push(dag);
    }

    removeVab(dag) {
        var index = this.vabDagar.findIndex(dag);
        if (index !== -1)
            this.vabDagar.splice(dag);
    }
    addSjukDag(dag) {
        this.sjukDagar.push(dag);
    }

    removeSjukDag(dag) {
        var index = this.sjukDagar.findIndex(dag);
        if (index !== -1)
            this.sjukDagar.splice(dag);
    }
    addSemester(dag) {
        this.semesterDagar.push(dag);
    }

    removeSemester(dag) {
        var index = this.semesterDagar.findIndex(dag);
        if (index !== -1)
            this.semesterDagar.splice(dag);
    }

    summaFaktura() {
        return this.projektTider.map(x => x.summa()).reduce((a, b) => a + b, 0);
    }

    summaTimmar() {
        return this.projektTider.map(x => parseInt(x.timmar)).reduce((a, b) => a + b, 0);
        // console.log(this.projektTider)
        // let timlista = this.projektTider.map(x => parseInt(x.timmar));
        // console.log(timlista)
        // let antal = timlista.reduce((a, b) => a + b);
        // console.log(antal)
        // return antal;
    }

    format() {
        var rapport = '';

        rapport += 'Kollega             Period\n';
        rapport += (this.kollega.namn + '                    ').substring(0, 20) + this.period.format() + '\n\n';

        rapport += 'Kund           Projekt        Timmar    Pris      Summa\n';
        this.projektTider.forEach(function (tid) { rapport += tid.format() + '\n' });

        rapport += '--------------------------------------------------------\n';
        rapport += 'Totalt                        ' +
            (this.summaTimmar() + '          ').slice(0, 10) + '          ' +
            this.summaFaktura() + '\n';


        rapport += '\nSjuk\n'
        this.sjukDagar.forEach(function (dag) { rapport += dag.format() + '\n' });

        rapport += '\nVAB\n'
        this.vabDagar.forEach(function (dag) { rapport += dag.format() + '\n' });

        rapport += '\nSemester\n'
        this.semesterDagar.forEach(function (dag) { rapport += dag.format() + '\n' });

        return rapport;
    }
}

export class Dag {
    constructor(datum, kommentar) {
        this.datum = datum;
        this.kommentar = kommentar;
    }

    format() {
        return this.datum.toISOString().slice(0, 10) + ' ' + this.kommentar;
    }
}

export class Kollega {
    constructor(namn, email) {
        this.namn = namn;
        this.email = email;
    }
}

export class Period {
    constructor(år, månad) {
        var now = new Date();

        if (år > 0) {
            this.lastDay = new Date(år, månad + 1, 0);
            this.firstDay = new Date(år, (månad + 12) % 12, 1);
        }
        else {

            if (now.getDate() < 10) {
                this.lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
                this.firstDay = new Date(now.getFullYear(), (now.getMonth() - 1 + 12) % 12, 1);
            }
            else {
                this.lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                this.firstDay = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
            }
        }

    }

    format() {
        return this.firstDay.getFullYear() + '-' + (this.firstDay.getMonth() + 1) + '-' + this.firstDay.getDate() + ' - ' + this.lastDay.getFullYear() + '-' + (this.lastDay.getMonth() + 1) + '-' + this.lastDay.getDate()
    }
}

export class Tid {
    constructor(kund, projekt, timmar, timpris) {
        this.kund = kund;
        this.projekt = projekt;
        this.timmar = timmar;
        this.timpris = timpris;
    }

    summa() {
        return this.timmar * this.timpris;
    }

    format() {
        var result = '';
        result += (this.kund + '               ').substring(0, 15);
        result += (this.projekt + '               ').substring(0, 15);
        result += (this.timmar + '          ').substring(0, 10);
        result += (this.timpris + '          ').substring(0, 10);
        result += (this.summa() + '          ').substring(0, 10);
        return result;
    }
}