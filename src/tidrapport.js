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
        var index = this.projektTider.findIndex(tid);
        if (index !== -1)
            this.projektTider.splice(tid);
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
        return this.projektTider.reduce(function (a, b) { return a + b.summa(); }, 0)
    }

    summaTimmar() {
        return this.projektTider.reduce(function (a, b) { return a + b.timmar; }, 0)
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
            this.summaFaktura()+'\n';


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
        this.år = år;
        this.månad = månad;
    }

    format() {
        var firstDay = new Date(this.år, this.månad - 1, 1);
        var lastDay = new Date(this.år, this.månad - 1 + 1, 0);
        
        return firstDay.toISOString().slice(0, 10) + ' - ' + lastDay.toISOString().slice(0, 10);
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