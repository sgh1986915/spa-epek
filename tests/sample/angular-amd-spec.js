define(['app/angular-amd'], function(Ctrl) {
  // jasmine
  describe('something', function() {

    it('should pass', function() {
      var sut = new Ctrl();
      expect(sut.add(1,2)).toBe(3);
    });
    it('should fail', function() {
      var sut = new Ctrl();
      expect(sut.add(1,2)).toBe('tres');
    });

  });
});

