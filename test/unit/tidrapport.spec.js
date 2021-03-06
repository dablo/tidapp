import { Tidrapport } from '../../src/tidrapport';
import { Kollega } from '../../src/tidrapport';
import { Period } from '../../src/tidrapport';
import { Tid } from '../../src/tidrapport';
import { Dag } from '../../src/tidrapport';

describe('kollega', () => {

    it('har en email', () => {
        expect(new Kollega('David Blomberg', 'david.blomberg@aptitud.se').email).toBe('david.blomberg@aptitud.se');
    });

    it('har ett namn', () => {
        expect(new Kollega('David Blomberg', 'david.blomberg@aptitud.se').namn).toBe('David Blomberg');
    });

});


describe('period', () => {

    let februari = new Period(2016, 1);

    it('har en startdag', () => {
        expect(februari.firstDay.getDate()).toBe(new Date('2016-02-01').getUTCDate());
    });

    it('har en slutdag', () => {
        expect(februari.lastDay.getDate()).toBe(new Date('2016-02-29').getUTCDate());
    });

    it('formaterar datum som yyy-MM-dd', () => {
        expect(februari.format()).toBe('2016-02-01 - 2016-02-29');
    });

});

describe('tid', () => {
    var tid = new Tid("Scania", "Pins", 150, 810);

    it('kalkylerar summan', () => {
        expect(tid.summa()).toBe(121500);
    });

    it('formaterar till text', () => {
        expect(tid.format()).toBe("Scania         Pins           150       810       121500    ");
    });

});

describe('tidrapport', () => {

    var david = new Kollega('David Blomberg', 'david.blomberg@aptitud.se');
    var oktober = new Period();

    it('har en kollega', () => {
        expect(new Tidrapport(david, oktober).kollega).toBe(david);
    });

    it('har en period', () => {
        expect(new Tidrapport(david, oktober).period).toBe(oktober);
    });

    it('har en kollega med namn David Blomberg', () => {
        expect(new Tidrapport(david, oktober).kollega.namn).toBe("David Blomberg");
    });

    it('kan lägga till tid', () => {
        var rapport = new Tidrapport(david, oktober);
        var scaniatid = new Tid("Scania", "Pins", 150, 810);
        rapport.addTid(scaniatid);
        expect(rapport.projektTider.length).toBe(1);
    });

    it('kan ta bort tid', () => {
        var rapport = new Tidrapport(david, oktober);
        var scaniatid = new Tid("Scania", "Pins", 150, 810);
        rapport.addTid(new Tid("Scania", "Pins", 150, 811));
        rapport.addTid(new Tid("Scania", "Pins", 150, 812));
        rapport.addTid(new Tid("Scania", "Pins", 150, 810));
        rapport.removeTid(scaniatid);
        expect(rapport.projektTider.length).toBe(2);
    });

    it('kan beräkna summan för hela rapporten', () => {
        let rapport = new Tidrapport(david, oktober);
        let scaniatid1 = new Tid("Scania", "Pins", 100, 500);
        let scaniatid2 = new Tid("Scania", "Pins", 50, 1000);
        rapport.addTid(scaniatid1);
        rapport.addTid(scaniatid2);
        expect(rapport.summaFaktura()).toBe(100000);
    });


    it('kan summera timmar för hela rapporten', () => {
        let rapport = new Tidrapport(david, oktober);
        let scaniatid1 = new Tid("Scania", "Pins", 100, 500);
        let scaniatid2 = new Tid("Scania", "Pins", 50, 1000);
        rapport.addTid(scaniatid1);
        rapport.addTid(scaniatid2);

        expect(rapport.summaTimmar()).toBe(150);
    });

    it('har en kollega med namn David Blomberg', () => {
        expect(new Tidrapport(david, oktober).kollega.namn).toBe("David Blomberg");
    });

    it('kan skapa en rapport', () => {
        var rapport = new Tidrapport(david, oktober);
        rapport.addTid(new Tid("Scania", "Pins", 100, 1000));
        rapport.addTid(new Tid("Scania", "Pins", 100, 500));
        rapport.addSjukDag(new Dag(new Date(2016, 10, 5), 'Förkyld'));
        rapport.addVab(new Dag(new Date(2016, 10, 6), 'Natalie'));
        rapport.addSemester(new Dag(new Date(2016, 10, 7), 'Kreta'));

        expect(rapport.format().indexOf('150000') > 1).toBe(true);
        expect(rapport.format().indexOf('Förkyld') > 1).toBe(true);
        expect(rapport.format().indexOf('Natalie') > 1).toBe(true);
        expect(rapport.format().indexOf('Kreta') > 1).toBe(true);
    });

});
