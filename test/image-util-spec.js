var imageUtil = require("../services/image-util");

describe("썸네일 계산", function() {
  it("이미지 가로세로 같은 비율, 썸네일 같은 비율", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 400, 200, 200);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 같은 비율, 썸네일 다른 비율 세로긴", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 400, 100, 200);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 같은 비율, 썸네일 다른 비율 가로긴", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 400, 200, 100);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 같은 비율, 썸네일 하나만 있는 경우 가로", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 400, 200, null);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 같은 비율, 썸네일 하나만 있는 경우 세로", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 400, null, 100);
    expect(resizeInfo.resizeWidth).toBe(100);
    expect(resizeInfo.resizeHeight).toBe(100);
  });

  it("이미지 가로세로 다른 비율 세로긴, 썸네일 같은 비율", function() {
    var resizeInfo = imageUtil.getResizeInfo(600, 400, 200, 200);
    expect(resizeInfo.resizeWidth).toBe(300);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 다른 비율 세로긴, 썸네일 다른 비율 세로긴", function() {
    var resizeInfo = imageUtil.getResizeInfo(600, 400, 100, 200);
    expect(resizeInfo.resizeWidth).toBe(300);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 다른 비율 세로긴, 썸네일 다른 비율 가로긴", function() {
    var resizeInfo = imageUtil.getResizeInfo(600, 400, 200, 100);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(133);
  });
  it("이미지 가로세로 다른 비율 세로긴, 썸네일 하나만 있는 경우 가로", function() {
    var resizeInfo = imageUtil.getResizeInfo(600, 400, 200, null);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(133);
  });
  it("이미지 가로세로 다른 비율 세로긴, 썸네일 하나만 있는 경우 세로", function() {
    var resizeInfo = imageUtil.getResizeInfo(600, 400, null, 100);
    expect(resizeInfo.resizeWidth).toBe(150);
    expect(resizeInfo.resizeHeight).toBe(100);
  });

  it("이미지 가로세로 다른 비율 가로긴, 썸네일 같은 비율", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 600, 200, 200);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(300);
  });
  it("이미지 가로세로 다른 비율 가로긴, 썸네일 다른 비율 세로긴", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 600, 100, 200);
    expect(resizeInfo.resizeWidth).toBe(133);
    expect(resizeInfo.resizeHeight).toBe(200);
  });
  it("이미지 가로세로 다른 비율 가로긴, 썸네일 다른 비율 가로긴", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 600, 200, 100);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(300);
  });
  it("이미지 가로세로 다른 비율 가로긴, 썸네일 하나만 있는 경우 가로", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 600, 200, null);
    expect(resizeInfo.resizeWidth).toBe(200);
    expect(resizeInfo.resizeHeight).toBe(300);
  });
  it("이미지 가로세로 다른 비율 가로긴, 썸네일 하나만 있는 경우 세로", function() {
    var resizeInfo = imageUtil.getResizeInfo(400, 600, null, 100);
    expect(resizeInfo.resizeWidth).toBe(66);
    expect(resizeInfo.resizeHeight).toBe(100);
  });
});