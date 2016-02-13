describe('sell', function() {
  var headers = {
    video: 'Make Your Item Stand Out',
    image: 'Add a Picture or Two'
  };


  beforeEach(function() {
    browser().navigateTo('/#/sell');
    expect(element('h1').text()).toMatch(headers.video);
  });


  it('should alow next step without adding a video', function() {
    element('a.image').click();
    expect(element('h1').text()).toMatch(headers.image);
  });

  it('should not alow next step without adding an image', function() {
    element('a.image').click();
    expect(element('h1').text()).toMatch(headers.image);

    element('a.description').click();
    expect(element('h1').text()).toMatch(headers.image);

    element('button.btn-next').click();
    expect(element('h1').text()).toMatch(headers.image);
  });

});