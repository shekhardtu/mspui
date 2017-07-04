var dataJson,dataUrl='assets/db/content.json';function getJson(a){var b=$.Deferred();return $.ajax({url:a,dataType:'json'}).done(function(c){return mData=c,b.resolve(c)}),b.promise()}(function(){getJson(dataUrl).done(function(b){window.dataJson=b.data.products;var c=buidGridData(dataJson),d=getObjPropertyCount(dataJson,'global_attr_brand'),f=getObjPropertyCount(dataJson,'global_attr_base_colour'),g=getObjPropertyCount(dataJson,'global_attr_article_type'),h=getFiltersDom('colour',f),j=getFiltersDom('brand',d),k=getFiltersDom('article',g)})})(dataUrl);function clearAll(a,b){if(a);else var c=buidGridData(b),d=getObjPropertyCount(b,'global_attr_brand'),f=getObjPropertyCount(b,'global_attr_base_colour'),g=getObjPropertyCount(b,'global_attr_article_type'),h=getFiltersDom('colour',f),j=getFiltersDom('brand',d),k=getFiltersDom('article',g)}function applyFilter(a,b){var d=buidGridData(a),f=getObjPropertyCount(dataJson,'global_attr_brand'),g=getObjPropertyCount(dataJson,'global_attr_base_colour'),h=getObjPropertyCount(dataJson,'global_attr_article_type'),j=getFiltersDom('colour',g,b),k=getFiltersDom('brand',f,b),l=getFiltersDom('article',h,b)}var filterValuesObj={add:{colour:[],brand:[],article:[]},remove:{colour:[],brand:[],article:[]},length:0},qS=window.location.search;function loadQueryString(a){for(var d,b={add:{colour:[],brand:[],article:[]},remove:{colour:[],brand:[],article:[]},length:0},c=a.replace(/[?]/g,'').split('&'),f=0;f<c.length;f++)d=c[f].split('='),'colour'==d[0]?($.merge(b.add.colour,d[1].split('|')),b.length+=2):'brand'==d[0]?($.merge(b.add.brand,d[1].split('|')),b.length+=2):'article'==d[0]&&($.merge(b.add.article,d[1].split('|')),b.length+=1);return b}setTimeout(function(){if(window.location.search){var a=loadQueryString(qS),b=dataAfterFilter(a,dataJson);applyFilter(b,a)}},200);function buildUrl(){window.history.pushState('','','?brand=roadster&colour=red')}$(document).ready(function(){$(document).on('click','.js-fltr-val--mltpl>[type=checkbox]:not(.enabled)',function(){$(this).addClass('enabled');var b=$(this).closest('.js-fltr').data('groupname'),c=$(this).val();filterValuesObj.add[b].push(c),filterValuesObj.length+=1;var d=dataAfterFilter(filterValuesObj,dataJson);applyFilter(d,filterValuesObj);var f='';0<filterValuesObj.add.brand.length&&(f&&(f+='&'),f+='brand='+filterValuesObj.add.brand.join('|')),0<filterValuesObj.add.article.length&&(f&&(f+='&'),f+='article='+filterValuesObj.add.article.join('|')),0<filterValuesObj.add.colour.length&&(f&&(f+='&'),f+='colour='+filterValuesObj.add.colour.join('|')),window.history.pushState('','','?'+f)}),$(document).on('click','.js-fltr-val--sngl>[type=radio]',function(){if('radio'==$(this)[0].type){$(this).addClass('enabled');var b=$(this).closest('.js-fltr').data('groupname'),c=$(this).val();filterValuesObj.add[b].length&&filterValuesObj.add[b].pop(),filterValuesObj.add[b].push(c),filterValuesObj.length+=1;var d=dataAfterFilter(filterValuesObj,dataJson);applyFilter(d,filterValuesObj)}else return!1;var f='';0<filterValuesObj.add.brand.length&&(f&&(f+='&'),f+='brand='+filterValuesObj.add.brand.join('|')),0<filterValuesObj.add.article.length&&(f&&(f+='&'),f+='article='+filterValuesObj.add.article.join('|')),0<filterValuesObj.add.colour.length&&(f&&(f+='&'),f+='colour='+filterValuesObj.add.colour.join('|')),window.history.pushState('','','?'+f)}),$(document).on('click','.js-fltr-val--mltpl>.enabled[type=checkbox]',function(){$(this).removeClass('enabled'),$(this).attr('checked',!1);var b=$(this).closest('.js-fltr').data('groupname');console.log('disabled');var c=$(this).val(),d=$.inArray(c,filterValuesObj.add[b]);if(filterValuesObj.add[b].splice(d,1),filterValuesObj.length-=1,0==filterValuesObj.length)clearAll('',dataJson);else{var f=dataAfterFilter(filterValuesObj,dataJson);applyFilter(f,filterValuesObj)}var g='';0<filterValuesObj.add.brand.length&&(g&&(g+='&'),g+='brand='+filterValuesObj.add.brand.join('|')),0<filterValuesObj.add.article.length&&(g&&(g+='&'),g+='article='+filterValuesObj.add.article.join('|')),0<filterValuesObj.add.colour.length&&(g&&(g+='&'),g+='colour='+filterValuesObj.add.colour.join('|')),g?g+='?'+g:g='',window.history.pushState('','','?'+g)}),$('.js-menu__hmbrgr-btn').on('click',function(){$('.js-sdbr').toggle()})});function dataAfterFilter(a,b){for(var c=[],d=b.length,f=0;f<d;f++)-1<$.inArray(b[f].global_attr_brand.toLowerCase(),a.add.brand)&&c.push(b[f]),-1<$.inArray(b[f].global_attr_article_type.toLowerCase(),a.add.article)&&c.push(b[f]),-1<$.inArray(b[f].global_attr_base_colour.toLowerCase(),a.add.colour)&&c.push(b[f]);return c}function buidGridData(a){for(var b='',c=a.length,d=0;d<c;d++)b+='<a href="#" class="prd-grid clearfix">                <div class="prd-grid--cell clearfix">                  <div class="prd__img">                    <img class="prd__img--src" src="'+a[d].search_image+'">                  </div>                  <div class="prd__cntnt">                    <div class="prd_lbl">                      <div class="prd__brnd">                       '+a[d].global_attr_brand+'                      </div>                      <div class="prd__name">                        '+a[d].stylename+'                      </div>                    </div>                    <div class="prd__prc">',b+=a[d].dre_discount_label?'<span class="prd__prc-slng">                      &#8377;'+a[d].discounted_price+'                    </span>                      <span class="prd__prc-mrp">&#8377;'+a[d].discounted_price+'                    </span>                                            <span class="prd__prc-dscnt">                      '+a[d].dre_discount_label+'                    </span>':'<span class="prd__prc-slng">                      &#8377;'+a[d].discounted_price+'                    </span>',b+='</div>                    <div class="prd__size">                      <span class="prd__size-smbl prd__size-lbl">Sizes: '+a[d].sizes+'</span>',b+='</div>                  </div>                </div>              </a>';return $('.js-prdct-wrpr').empty().append(b),b}function getObjPropertyCount(a,b){for(var b,h,c=a.length,d=[],f=[],g=0;g<c;g++)if(h=a[g][b],-1==$.inArray(h.toLowerCase(),d)){var j=a.filter(function(m){return m[b]==h});d.push(h.toLowerCase());var k=h.toLowerCase(),l=j.length;f.push({property:k,count:l})}return f}function getFiltersDom(a,b,c){b.length;'colour'==a?getColourFilterDom(b,c):'brand'==a?getBrandFilterDom(b,c):'article'==a&&getCategoryFilterDom(b,c)}function getCategoryFilterDom(a,b){var c='',d=a.length;c+='<div class="fltr__hdr">              <span class="fltr__hdr--ttl">Category('+d+')</span>              <span class="fltr__hdr--cler js-fltr__hdr--cler">Clear</span>            </div>';for(var f=0;f<d;f++){if(b&&-1<$.inArray(a[f].property.toLowerCase(),b.add.article))var g='checked',h='enabled';else var g='',h='';c+='<div class="fltr__inr js-fltr-val-wrpr">              <div class="fltr__cntnt brnd-lst">                <label class="fltr-val fltr-val--sngl js-fltr-val--sngl clearfix">                  <input class="fltr-val__inpt '+h+'" type="radio" name="quality" value="'+a[f].property+'"'+g+'>                  <span class="fltr-val__text">                    <span class="fltr-val__lbl">'+a[f].property+'</span>                    <span class="fltr-val__cnt">('+a[f].count+')</span>                  </span>                </label>              </div>            </div>'}$('.js-ctgry-fltr').empty().append(c)}function getColourFilterDom(a,b){var c='',d=a.length;c+='<div class="fltr__hdr clearfix">              <span class="fltr__hdr--ttl">Colour ('+d+')</span>              <span class="fltr__hdr--cler js-fltr__hdr--cler">Clear</span>            </div>';for(var f=0;f<d;f++){if(b&&-1<$.inArray(a[f].property.toLowerCase(),b.add.colour))var g='checked',h='enabled',j='fltr-val__lbl--acvt';else var g='',h='',j='';c+='<div class="fltr__inr js-fltr-val-wrpr">              <div class="fltr__cntnt clr-lst">                <label class="fltr-val js-fltr-val--mltpl '+j+' clearfix" style="border: 1px solid #ddd;background-color:'+a[f].property+';">                    <input class="fltr-val__inpt '+h+'" type= "checkbox" value= "'+a[f].property+'" '+g+'>                </label>              </div>            </div>'}return $('.js-clr-fltr').empty().append(c),c}function getBrandFilterDom(a,b){var c='',d=a.length;c+='<div class="fltr__hdr">              <span class="fltr__hdr--ttl">Brands<span class="js-fltr__hdr--ttl-count">('+d+')</span></span>              <span class="fltr__hdr--cler js-fltr__hdr--cler">Clear</span>            </div>';for(var f=0;f<d;f++){if(b&&-1<$.inArray(a[f].property.toLowerCase(),b.add.brand))var g='checked',h='enabled';else var g='',h='';c+='<div class="fltr__inr js-fltr-val-wrpr">              <div class="fltr__cntnt brnd-lst">                <label class="fltr-val fltr-val--mltpl js-fltr-val--mltpl clearfix">                  <input class="fltr-val__inpt '+h+'" type="checkbox" value="'+a[f].property+'" '+g+'>                  <span class="fltr-val__text">                    <span class="fltr-val__lbl">'+a[f].property+'</span>                    <span class="fltr-val__cnt">('+a[f].count+')</span>                  </span>                </label>              </div>            </div>'}return $('.js-brnd-fltr').empty().append(c),c}