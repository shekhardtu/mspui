var dataUrl = "assets/db/content.json",
  dataJson,
  $doc = $(document);



function getJson(url) {
  var dfd = $.Deferred();
  $.ajax({
    url: url,
    dataType: 'json'
  }).done(function (response) {
    mData = response;
    return dfd.resolve(response);
  });
  return dfd.promise();
}

;
(function freshRequest() {
  getJson(dataUrl).done(function (response) {
    window.dataJson = response.data.products;
    // console.log(response.data.results.products);
    var productGridDom = buidGridData(dataJson),
      brandObjWithCount = getObjPropertyCount(dataJson, 'global_attr_brand'),
      colourObjWithCount = getObjPropertyCount(dataJson, 'global_attr_base_colour'),
      aritcleTypeCount = getObjPropertyCount(dataJson, 'global_attr_article_type'),
      coloursDom = getFiltersDom('colour', colourObjWithCount),
      brandsDom = getFiltersDom('brand', brandObjWithCount),
      articlesDom = getFiltersDom('article', aritcleTypeCount);
  });
}(dataUrl));

function clearAll(type, dataJson) {
  if (type) {

  } else {
    var productGridDom = buidGridData(dataJson),
      brandObjWithCount = getObjPropertyCount(dataJson, 'global_attr_brand'),
      colourObjWithCount = getObjPropertyCount(dataJson, 'global_attr_base_colour'),
      aritcleTypeCount = getObjPropertyCount(dataJson, 'global_attr_article_type'),
      coloursDom = getFiltersDom('colour', colourObjWithCount),
      brandsDom = getFiltersDom('brand', brandObjWithCount),
      articlesDom = getFiltersDom('article', aritcleTypeCount);
  }
}

function applyFilter(filteredArr, filterValuesObj) {
  // console.log(response.data.results.products);
  var slctdOptn = '',
    productGridDom = buidGridData(filteredArr),
    brandObjWithCount = getObjPropertyCount(dataJson, 'global_attr_brand'),
    colourObjWithCount = getObjPropertyCount(dataJson, 'global_attr_base_colour'),
    aritcleTypeCount = getObjPropertyCount(dataJson, 'global_attr_article_type'),
    coloursDom = getFiltersDom('colour', colourObjWithCount, filterValuesObj),
    brandsDom = getFiltersDom('brand', brandObjWithCount, filterValuesObj),
    articlesDom = getFiltersDom('article', aritcleTypeCount, filterValuesObj);
}

var filterValuesObj = {
  add: {
    colour: [],
    brand: [],
    article: []
  },
  remove: {
    colour: [],
    brand: [],
    article: []
  },
  length: 0
};

var qS = window.location.search;

function loadQueryString(qS) {
  var filterValuesObj = {
    add: {
      colour: [],
      brand: [],
      article: []
    },
    remove: {
      colour: [],
      brand: [],
      article: []
    },
    length: 0
  };
  var url = qS.replace(/[?]/g, "").split('&');
  var param;
  for (var i = 0; i < url.length; i++) {
    param = url[i].split('=');
    if (param[0] == 'colour') {
      $.merge(filterValuesObj.add.colour, param[1].split('|'));
      filterValuesObj.length += 2;
    } else if (param[0] == 'brand') {
      $.merge(filterValuesObj.add.brand, param[1].split('|'));
      filterValuesObj.length += 2;
    } else if (param[0] == 'article') {
      $.merge(filterValuesObj.add.article, param[1].split('|'));
      filterValuesObj.length += 1;
    }
  }
  return filterValuesObj;
}

setTimeout(function () {
  if (window.location.search) {
    var queryValue = loadQueryString(qS);
    var filteredArr = dataAfterFilter(queryValue, dataJson);
    applyFilter(filteredArr, queryValue);
  }
}, 200);


function buildUrl(groupName, searchString) {
  var string = '?brand=roadster&colour=red';
  window.history.pushState('', '', '?brand=roadster&colour=red');
}

$doc.ready(function () {
  $doc.on('click', '.js-fltr-val--mltpl>[type=checkbox]:not(.enabled)', function (e) {
    $(this).addClass("enabled");
    var groupName = $(this).closest('.js-fltr').data('groupname');
    var filtervalue = $(this).val();
    filterValuesObj.add[groupName].push(filtervalue);
    filterValuesObj.length += 1;
    var filteredArr = dataAfterFilter(filterValuesObj, dataJson);
    applyFilter(filteredArr, filterValuesObj);
    var url = '';

    if (filterValuesObj.add['brand'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'brand=' + filterValuesObj.add['brand'].join('|');
    }
    if (filterValuesObj.add['article'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'article=' + filterValuesObj.add['article'].join('|');
    }
    if (filterValuesObj.add['colour'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'colour=' + filterValuesObj.add['colour'].join('|');
    }
    window.history.pushState('', '', '?' + url);
  });




  $doc.on('click', '.js-fltr-val--sngl>[type=radio]', function (e) {
    if ($(this)[0].type == "radio") {
      $(this).addClass("enabled");
      var groupName = $(this).closest('.js-fltr').data('groupname');
      var filtervalue = $(this).val();
      if (filterValuesObj.add[groupName].length) {
        filterValuesObj.add[groupName].pop();
      }
      filterValuesObj.add[groupName].push(filtervalue);
      filterValuesObj.length += 1;
      var filteredArr = dataAfterFilter(filterValuesObj, dataJson);
      applyFilter(filteredArr, filterValuesObj);
    } else {
      return false;
    }

    var url = '';

    if (filterValuesObj.add['brand'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'brand=' + filterValuesObj.add['brand'].join('|');
    }
    if (filterValuesObj.add['article'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'article=' + filterValuesObj.add['article'].join('|');
    }
    if (filterValuesObj.add['colour'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'colour=' + filterValuesObj.add['colour'].join('|');
    }
    window.history.pushState('', '', '?' + url);



  });

  $doc.on('click', '.js-fltr-val--mltpl>.enabled[type=checkbox]', function (e) {
    $(this).removeClass("enabled");
    $(this).attr('checked', false);
    var groupName = $(this).closest('.js-fltr').data('groupname');
    console.log("disabled");
    var filtervalue = $(this).val();
    var index = $.inArray(filtervalue, filterValuesObj.add[groupName]);
    filterValuesObj.add[groupName].splice(index, 1);
    filterValuesObj.length -= 1;
    if (filterValuesObj.length == 0) {
      clearAll("", dataJson);
    } else {
      var filteredArr = dataAfterFilter(filterValuesObj, dataJson);
      applyFilter(filteredArr, filterValuesObj);
    }
    var url = '';
    if (filterValuesObj.add['brand'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'brand=' + filterValuesObj.add['brand'].join('|');
    }
    if (filterValuesObj.add['article'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'article=' + filterValuesObj.add['article'].join('|');
    }
    if (filterValuesObj.add['colour'].length > 0) {
      if (url) {
        url += '&';
      }
      url += 'colour=' + filterValuesObj.add['colour'].join('|');
    }
    window.history.pushState('', '', '?' + url);

  });

  $('.js-menu__hmbrgr-btn').on("click", function () {
    $('.js-sdbr').toggle();
  });

});



function dataAfterFilter(filterValues, obj) {
  var newObjArr = [];
  var objLength = obj.length;

  for (var i = 0; i < objLength; i++) {
    if ($.inArray(obj[i].global_attr_brand.toLowerCase(), filterValues.add.brand) > -1) {
      newObjArr.push(obj[i]);
    }
    if ($.inArray(obj[i].global_attr_article_type.toLowerCase(), filterValues.add.article) > -1) {
      newObjArr.push(obj[i]);
    }
    if ($.inArray(obj[i].global_attr_base_colour.toLowerCase(), filterValues.add.colour) > -1) {
      newObjArr.push(obj[i]);
    }
  }
  return newObjArr;
}

function buidGridData(data) {
  var productGrid = '';
  var totalResults = data.length;
  for (var i = 0; i < totalResults; i++) {
    productGrid += '<a href="'+data[i].dre_landing_page_url+'" class="js-prd-grid prd-grid clearfix">\
                <div class="prd-grid--cell clearfix">\
                  <div class="prd__img">\
                    <img class="prd__img--src" src="' + data[i].search_image + '">\
                  </div>\
                  <div class="prd__cntnt">\
                    <div class="prd_lbl">\
                      <div class="prd__brnd">\
                       ' + data[i].global_attr_brand + '\
                      </div>\
                      <div class="prd__name">\
                        ' + data[i].stylename + '\
                      </div>\
                    </div>\
                    <div class="prd__prc">';

    if (data[i].dre_discount_label) {
      productGrid += '<span class="prd__prc-slng">\
                      &#8377;' + data[i].discounted_price + '\
                    </span>\
                      <span class="prd__prc-mrp">&#8377;' + data[i].discounted_price + '\
                    </span>\
                      \
                      <span class="prd__prc-dscnt">\
                      ' + data[i].dre_discount_label + '\
                    </span>';
    } else {
      productGrid += '<span class="prd__prc-slng">\
                      &#8377;' + data[i].discounted_price + '\
                    </span>';
    }
    productGrid += '</div>\
                    <div class="prd__size">\
                      <span class="prd__size-smbl prd__size-lbl">Sizes: ' + data[i].sizes + '</span>';

    productGrid += '</div>\
                  </div>\
                </div>\
              </a>';
  }
  $(".js-prdct-wrpr").empty().append(productGrid);
  return productGrid;
}

function getObjPropertyCount(obj, property) {
  var dataLength = obj.length,
    brands = [],
    propertyArr = [],
    property;
  for (var i = 0; i < dataLength; i++) {
    var haystack = obj[i][property];
    if ($.inArray(haystack.toLowerCase(), brands) == -1) {
      var brandOccurance = obj.filter(function (word) {
        return word[property] == haystack;
      });
      brands.push(haystack.toLowerCase());
      var key = haystack.toLowerCase();
      var val = brandOccurance.length;
      propertyArr.push({
        "property": key,
        "count": val
      });
    }
  }
  return propertyArr;
}

function getFiltersDom(filterType, filterObj, filterValuesObj) {
  var dom = '',
    filterLength = filterObj.length;
  if (filterType == 'colour') {
    getColourFilterDom(filterObj, filterValuesObj);
  } else if (filterType == 'brand') {
    getBrandFilterDom(filterObj, filterValuesObj);
  } else if (filterType == 'article') {
    getCategoryFilterDom(filterObj, filterValuesObj);
  }
}

function getCategoryFilterDom(filterObj, filterValuesObj) {
  var dom = '',
    filterLength = filterObj.length;
  dom += '<div class="fltr__hdr">\
              <span class="fltr__hdr--ttl">Category(' + filterLength + ')</span>\
              <span class="fltr__hdr--cler js-fltr__hdr--cler">Clear</span>\
            </div>';
  for (var i = 0; i < filterLength; i++) {
    if (filterValuesObj && ($.inArray(filterObj[i].property.toLowerCase(), filterValuesObj.add.article) > -1)) {
      var value = "checked";
      var addClass = "enabled";
    } else {
      var value = '';
      var addClass = "";
    }
    dom += '<div class="fltr__inr js-fltr-val-wrpr">\
              <div class="fltr__cntnt brnd-lst">\
                <label class="fltr-val fltr-val--sngl js-fltr-val--sngl clearfix">\
                  <input class="fltr-val__inpt ' + addClass + '" type="radio" name="quality" value="' + filterObj[i].property + '"' + value + '>\
                  <span class="fltr-val__text">\
                    <span class="fltr-val__lbl">' + filterObj[i].property + '</span>\
                    <span class="fltr-val__cnt">(' + filterObj[i].count + ')</span>\
                  </span>\
                </label>\
              </div>\
            </div>';
  }
  $('.js-ctgry-fltr').empty().append(dom);
}

function getColourFilterDom(filterObj, filterValuesObj) {
  var dom = '',
    filterLength = filterObj.length;

  dom += '<div class="fltr__hdr clearfix">\
              <span class="fltr__hdr--ttl">Colour (' + filterLength + ')</span>\
              <span class="fltr__hdr--cler js-fltr__hdr--cler">Clear</span>\
            </div>';
  for (var i = 0; i < filterLength; i++) {
    if (filterValuesObj && ($.inArray(filterObj[i].property.toLowerCase(), filterValuesObj.add.colour) > -1)) {
      var value = "checked";
      var addClass = "enabled";
      var activate = 'fltr-val__lbl--acvt';
    } else {
      var value = '';
      var addClass = '';
      var activate = '';
    }
    dom += '<div class="fltr__inr js-fltr-val-wrpr">\
              <div class="fltr__cntnt clr-lst">\
                <label class="fltr-val js-fltr-val--mltpl ' + activate + ' clearfix" style="border: 1px solid #ddd;background-color:' + filterObj[i].property + ';">\
                    <input class="fltr-val__inpt ' + addClass + '" type= "checkbox" value= "' + filterObj[i].property + '" ' + value + '>\
                </label>\
              </div>\
            </div>';
  }
  $('.js-clr-fltr').empty().append(dom);
  return dom;
}

function getBrandFilterDom(filterObj, filterValuesObj) {
  var dom = '',
    filterLength = filterObj.length;

  dom += '<div class="fltr__hdr">\
              <span class="fltr__hdr--ttl">Brands<span class="js-fltr__hdr--ttl-count">(' + filterLength + ')</span></span>\
              <span class="fltr__hdr--cler js-fltr__hdr--cler">Clear</span>\
            </div>';
  for (var i = 0; i < filterLength; i++) {
    if (filterValuesObj && ($.inArray(filterObj[i].property.toLowerCase(), filterValuesObj.add.brand) > -1)) {
      var value = "checked";
      var addClass = "enabled";
    } else {
      var value = '';
      var addClass = "";
    }
    dom += '<div class="fltr__inr js-fltr-val-wrpr">\
              <div class="fltr__cntnt brnd-lst">\
                <label class="fltr-val fltr-val--mltpl js-fltr-val--mltpl clearfix">\
                  <input class="fltr-val__inpt ' + addClass + '" type="checkbox" value="' + filterObj[i].property + '" ' + value + '>\
                  <span class="fltr-val__text">\
                    <span class="fltr-val__lbl">' + filterObj[i].property + '</span>\
                    <span class="fltr-val__cnt">(' + filterObj[i].count + ')</span>\
                  </span>\
                </label>\
              </div>\
            </div>';
  }
  $('.js-brnd-fltr').empty().append(dom);
  return dom;
}



/******* *** ******/
/* Single Page Scripting
/******* ** *******/
window.showTime = '';

$doc.on('click', '.js-prd-grid', function (e) {
  e.preventDefault();
  var url = $(this).attr('href');
  window.location.href = 'single.html?param=' + url;
});


$doc.on('mouseover', '.js-prdct-dtl__img__thmbnl--item-src', function () {
  var src = $(this).data('src');
  if (showTime) {
    window.clearTimeout(showTime); // to hold the mouse hover image while switching to other image
  }
  $(".js-prdct-dtl--img-src").attr('src', src);
}).on('mouseleave', '.js-prdct-dtl__img__thmbnl--item-src', function () {
  window.showTime = window.setTimeout(function () {
    var imgPath = $(".js-prdct-dtl--img-src").data("imgpath");
    $(".js-prdct-dtl--img-src").attr('src', imgPath);
  }, 200);
});

if (window.location.pathname.indexOf('single')) {
  var urlArr = window.location.href.split('/');
  var prdctId = urlArr[urlArr.length - 2];
  getJson(dataUrl).done(function (response) {
    response = response.data.products;
    for (var obj in response) {
      if (response[obj].styleid == prdctId) {
        buildSinglePageRightSide(response[obj]);
        buildSinglePageLeftSide(response[obj].search_image, response[obj].image_entries);
      }
    }
  });

}

function buildSinglePageRightSide(pageData) {
  var dom = '';
  dom += '<div class="prdct-dtl__ttl">' + pageData.stylename + '</div>\
            <div class="prdct-dtl__prc"><span class="prdct-dtl__prc--mrp">Rs. ' + pageData.price + '</span><span class="prdct-dtl__prc--dscnt">' + pageData.dre_discount_label + '</span></div>\
            <div class="prdct-dtl__prc--slng">Rs. ' + pageData.discounted_price + '</div>\
            <div class="prdct-dtl__prc--info">Additional tax may apply; charged at checkout</div>\
          \
            <div class="prdct-dtl__ofr">\
              <div class="prdct-dtl__ofr-deal">Best Price: <span class="prdct-dtl__ofr-deal--prc"> ' + pageData.discounted_price + '</span></div>\
              <div class="prdct-dtl__ofr-implctn">\
                Coupon code: SALE10 Applicable on: Orders above Rs. 1499 Max Discount: 30% of MRP (Your total saving: Rs. 329, excluding\
                tax)\
              </div>\
            </div>\
            \
            <div class="prdct-dtl__buy clearfix">\
              <div class="prdct-dtl__buy--btn btn clearfix"> Buy Now</div>\
              <div class="prdct-dtl__buy--optn clearfix">Check Delivery Options</div>\
            </div>\
            <div class="prdct-dtl__ftr clearfix">\
              <div class="prdct-dtl__ftr--name">\
                <div class="prdct-dtl__ftr--name-item clearfix">Color</div>\
                <div class="prdct-dtl__ftr--name-item clearfix">Brand</div>\
                <div class="prdct-dtl__ftr--name-item clearfix">Category</div>\
              </div>\
              <div class="prdct-dtl__ftr--slab">\
                <div class="prdct-dtl__ftr--slab-item clearfix">' + pageData.global_attr_base_colour + '</div>\
                <div class="prdct-dtl__ftr--slab-item clearfix">' + pageData.global_attr_brand + '</div>\
                <div class="prdct-dtl__ftr--slab-item clearfix">' + pageData.product_additional_info + '</div>\
              </div>\
            </div>\
            <div class="prdct-dtl--othr-optn">\
              <div>\
                <div class="prdct-dtl--bold">Product Details</div>\
                <div class="prdct-dtl--light">Black striped woven A-line dress, has a round neck, three-quarter sleeves\
                </div>\
              </div>\
              <div class="prdct-dtl--bold">Material & Care</div>\
              \
              <div class="prdct-dtl--light">100% cotton </div>\
              <div class="prdct-dtl--light">Machine-wash </div>';
  $('.js-prdct-dtl--rght').append(dom);
  return dom;
}

function buildSinglePageLeftSide(previewImage, pageData) {
  var dom = '';
  dom += '<div class="prdct-dtl--img">\
              <img class="prdct-dtl--img-src js-prdct-dtl--img-src" src="'+previewImage+'" data-imgpath="'+previewImage+'"\
                alt="">\
            </div>\
            <div class="prdct-dtl__img__thmbnl">';
  for (var i = 0; i < pageData.length; i++) {
    dom += '   <div class="prdct-dtl__img__thmbnl--item">\
                <img class="prdct-dtl__img__thmbnl--item-src js-prdct-dtl__img__thmbnl--item-src" data-src="'+JSON.parse(pageData[i]).image.path+'" src="'+JSON.parse(pageData[i]).image.path+'" alt="">\
              </div>';
    } 
  dom += '</div></div>';
  $('.js-prdct-dtl--left').append(dom);
  return dom;
}