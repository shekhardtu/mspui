 /* Search scoring functionality [Start] */
 $(document).on('input', '.search-form input', function () {
     weightage = {
         'fullMatch': $('.full').val(),
         'partialMatch': $('.partial').val(),
         'uniqueMatch': $('.unique').val(),
         'repeatMatch': $('.repeat').val(),
         'sequence': $('.sequence').val(),
         'caseMatch': $('.case_sensitive').val(),
         'minRelevance': $('.min_rel').val()
     };
     localStorage.weightage = JSON.stringify(weightage);
 });

 var updateFormLabels = function (weightage) {
     $('.full').val(weightage.fullMatch);
     $('.partial').val(weightage.partialMatch);
     $('.unique').val(weightage.uniqueMatch);
     $('.repeat').val(weightage.repeatMatch);
     $('.sequence').val(weightage.sequence);
     $('.case_sensitive').val(weightage.caseMatch);
     $('.min_rel').val(weightage.minRelevance);
 };


 var defaultWeightage = {
         fullMatch: 2,
         partialMatch: 1,
         uniqueMatch: 3,
         repeatMatch: 2,
         sequence: 1.5,
         caseMatch: 2,
         minRelevance: .6
     },
     weightage = localStorage.weightage ? JSON.parse(localStorage.weightage) : defaultWeightage;
 updateFormLabels(weightage);

 /* Search scoring functionality [End] */
 // Global var
 var searchWordsArr = [],
     sDataJson = {},
     sequence = [];


 init();


 function processJson(fileName) {
     var dfd = $.Deferred();

     $.ajax({
         url: fileName,
         dataType: 'json'
     }).done(function (response) {
         mData = response;
         return dfd.resolve(response);
     });
     return dfd.promise();
 };



 function init() {
     processJson('db/sdata.json').done(function (response) {
         var jsonData = sDataJson = response;
         searchWordsArr = splittingInWordsArray(jsonData);
     });
 }

 // keywords Build functions 
 function splittingInWordsArray(mData) {
     var tempObj = {};
     var searchArr = [];
     for (id in mData) {
         var wordArr = (mData[id].question).replace(/[^a-zA-Z0-9' ]/g, '').split(' ').filter(function () {
             return true;
         });

         for (var i = 0, len = wordArr.length; i < len; i++) {
             if (wordArr[i] == '') {
                 break;
             }
             searchArr.push({
                 'word': wordArr[i],
                 'questionId': id,
                 'answerWordIndex': id + '-' + '0',
                 'valueFactor': 0.2,
                 'sentenceIndex': i,
                 'searchArrayIndex': searchArr.length

             });
         }

         for (var j = 0, jlen = mData[id].answer.length; j < jlen; j++) {
             var answerWords = mData[id].answer[j].replace(/[^a-zA-Z0-9' ]/g, '').split(' ').filter(function () {
                 return true;
             });
             for (var p = 0, plen = answerWords.length; p < plen; p++) {
                 if (answerWords[p] == '') {
                     break;
                 }
                 searchArr.push({
                     'word': answerWords[p],
                     'questionId': id,
                     'answerWordIndex': id + '-' + j,
                     'valueFactor': 0.1,
                     'sentenceIndex': p,
                     'searchArrayIndex': searchArr.length ? searchArr.length : 0

                 });
             }
             delete answerWords;
         }
         delete wordArr;

     };
     builtData = sortedByWord(searchArr);
     return searchArr;
 }

 function sortedByWord(searchArray) {
     searchArray.sort(function (a, b) {
         var alc = a.word.toLowerCase().toString(),
             blc = b.word.toLowerCase().toString();
         return alc > blc ? 1 : alc < blc ? -1 : 0;
     });
     return searchArray;
 }

 var sortQuestionsAns = function (resultArr) {
     resultArr.sort(function (a, b) {
         return b.match_score - a.match_score
     });
     return resultArr;
 }

 var timeout;
 $(document).on('input', '.search', function () {
     $this = $(this);
     clearTimeout(timeout);
     $('.js-sec-wrpr-res').html('');
     timeout = setTimeout(function () {
         window.startTime = performance.now();
         var term = $this.val().trim();
         var stopWords = ['the', 'is', 'a', 'all', 'am', 'an', 'and',
             'are',
             'as',
             'at',
             'be',
             'by',
             'do',
             'in',
             'into',
             'it',
             'its',
             'my',
             'no',
             'nor',
             'not',
             'of',
             'on',
             'or',
             'that',
             'then',
             'this',
             'to',
             'was',
             'were'
         ];
         var fiteredSearchKeywords = term.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ').replace(
             /[\s\t\r\n]+/g, ' ').split(' ').reduce(function (a, v) {
             if (v.length > 0 || (v === v.toUpperCase() && v.length > 1)) {
                 if (stopWords.indexOf(v) == -1) {
                     a.push(v);
                 }
             }
             return a;
         }, []);
          processSearch(fiteredSearchKeywords);
     }, 200);
 });

 var processSearch = function (searchKeywords) {
        if (searchKeywords.length <1) {
             return false;
         }

     // Searching and matching score [Start]
     var searchStartTime = performance.now();
     var searchResultArr = getSearchResult(searchKeywords, builtData);
     var searchEndTime = performance.now();
     var searchTime = (searchEndTime - searchStartTime) / 1000;
     // Searching and matching score [End]


     window.sortingStartTime = performance.now();
     var sortedSearchResult = searchResultArr.length && sortQuestionsAns(searchResultArr); //resultArr; 
     window.sortingEndTime = performance.now();

     // Dom Building time [Start]
     window.domBuildStartTime = performance.now();
     var dom = sortedSearchResult.length && buildDom(sortedSearchResult);
     $('.sec-wrpr-res, .js-search-time, .js-sort-time, .js-total-time, .js-dombuild-time').html('');
     $('.js-sec-wrpr-res').append(dom);
     var domBuildEndTime = performance.now();
     var domBuildTime = (domBuildEndTime - domBuildStartTime) / 1000;
     // Dom Building time [End]

     // text highlighting time [Start]
     highlightText(searchKeywords);
     // text highlighting  time [End]

     var processEndTime = performance.now();
     var totalTimeTaken = (processEndTime - startTime) / 1000;
     var sortingTime = (sortingEndTime - sortingStartTime) / 1000

     $('.js-search-time').append(searchTime.toFixed(4));
     $('.js-dombuild-time').append(domBuildTime.toFixed(4));
     $('.js-sort-time').append(sortingTime.toFixed(4));
     $('.js-total-time').append(totalTimeTaken.toFixed(4));

     return true;
 };

 var highlightText = function (searchItems) {
     for (var i = 0; i < searchItems.length; i++) {
         $('.sec-wrpr-res .sec').children().each(function () {
             var text = $(this).html();
             text = text.replace(new RegExp(searchItems[i], 'ig'), function (match) {
                 return ' <span class="hghlght">' + match.trim() + '</span>';
             });
             $(this).html(text.trim());
         });
     }
 }

 function getSearchResult(searchKeywordsArr, builtData) {
     var builtData = builtData,
         termArr = searchKeywordsArr,
         resultArr = [],
         tempObj = [],
         wordOccurrence;
     if (termArr.length > 0) {
         for (var i = 0, iLen = termArr.length; i < iLen; i++) {
             termArrIndex = binarySearch(builtData, termArr[i], true, 'multiple');
             if (termArrIndex !== -1 && termArrIndex.length >= 1) {
                 $.each(termArrIndex, function (indx, vlu) { // if results are comming in array ie. multiple occurrence of a word;
                     var questionId = builtData[vlu].questionId; // Every pair of answer and question contains a unique id.
                     var answerWordIndex = builtData[vlu].answerWordIndex; // If it is answer keyword it contains word index in that sentence

                     //Pass only array of object of highest match_score question and answer;

                     if (!sDataJson[questionId].wordOccurrence) {
                         sDataJson[questionId].wordOccurrence = [];
                         sDataJson[questionId].wordOccurrence.push(builtData[vlu].word);
                         wordOccurrence = 1;
                     } else if (sDataJson[questionId].wordOccurrence.indexOf(builtData[vlu].word) > -1) {
                         sDataJson[questionId].wordOccurrence.push(builtData[vlu].word);
                         wordOccurrence = 2;
                     } else {
                         sDataJson[questionId].wordOccurrence.push(builtData[vlu].word);
                         wordOccurrence = 1;
                     }

                     //squnc_id
                     var matchScore = 0;

                     if (wordOccurrence > 1) {
                         //Repeat Word [Tested]
                         matchScore += parseInt(weightage.repeatMatch);
                     } else if (wordOccurrence === 1) {
                         //Unique Word [Tested]
                         matchScore += parseInt(weightage.uniqueMatch);
                     }

                     if (termArr[i].toLowerCase() === builtData[vlu].word.toLowerCase()) {
                         //Full Search [Tested]
                         matchScore *= weightage.fullMatch;
                     } else {
                         //Partial Search [Tested]
                         matchScore *= weightage.partialMatch;
                     }

                     if (termArr[i] === builtData[vlu].word) {
                         //Case Sensitive [Tested]
                         matchScore *= weightage.caseMatch;
                     } else {
                         //Case Insensitive
                         //Do Nothing as of now
                     }

                     // sequence search matchscore
                     /* Checking if the result keyword completely matching with search keyword
                      if yes, on first iteration saving the keyword's original index position(searchArrayIndex) in json's keyword array.
                      onwords iterations, Checking if the searchArrayIndex exist in sequence array if not push again in sequence array
                      if exists, checking if current word's previous searchArrayIndex exist in sequence array using 'for loop'.
                      if current word's previous word (searchArrayIndex-1) contains in sequence array, we are alloting match score. */
                     if (sequence.length === 0 && termArr[i].toLowerCase() === builtData[vlu].word.toLowerCase()) {
                         sequence.push(builtData[vlu].searchArrayIndex);
                     } else {
                         if ((sequence.indexOf((builtData[vlu].searchArrayIndex - 1)) > -1)) { // On every input 
                             matchScore *= weightage.sequence;
                         } else {
                             sequence.push(builtData[vlu].searchArrayIndex);
                         }
                     }

                     if (tempObj.length < 1) {
                         tempObj.push({
                             questionId: questionId,
                             answerWordIndex: answerWordIndex,
                             match_score: matchScore
                         });
                     } else {
                         var flag = false;
                         for (var p = 0, pLen = tempObj.length; p < pLen; p++) {
                             if (tempObj[p].questionId === questionId) {
                                 tempObj[p].match_score += parseInt(matchScore);
                                 tempObj[p].answerWordIndex += ((tempObj[p].answerWordIndex).indexOf(answerWordIndex) > -1) ? '' : '|' +
                                     answerWordIndex;
                                 flag = true;
                             }
                         }
                         if (!flag) {
                             tempObj.push({
                                 questionId: questionId,
                                 answerWordIndex: answerWordIndex,
                                 match_score: matchScore
                             });
                         }

                     }
                 });

             }
         }
     }
     for (var d = 0, dlen = tempObj.length; d < dlen; d++) {
         delete sDataJson[tempObj[d].questionId].wordOccurrence

     }
     sequence = [];
     return tempObj;
 }



 function buildDom(sortedSearchedInfo) {
     var len = sortedSearchedInfo.length,
         dom = '',
         question,
         answer = '';

     for (var p = 0; p < len; p++) {
         question = sDataJson[sortedSearchedInfo[p].questionId].question;
         var ans_group = sortedSearchedInfo[p].answerWordIndex ? (sortedSearchedInfo[p].answerWordIndex).split('|') : 0;

         for (var i = 0, ilen = ans_group.length; i < ilen; i++) {
             var ans_id = ans_group[i] ? ans_group[i].split('-') : '';

             answer += '<div class="ans"><b>A: ' + ans_id[1] + '</b> ' + sDataJson[sortedSearchedInfo[p].questionId].answer[
                 ans_id[1]] + '</div>';
         }

         var tempDom = '<div class="sec" data-id="+ sortedSearchedInfo[p].match_score +">\
                 <div class="ques"><b>Q: ' + sortedSearchedInfo[p].questionId + '</b> ' + question +
             '    ::::: match score ' + sortedSearchedInfo[p].match_score + '</div>\
                    ' + answer + '\
                </div>';
         dom += tempDom;
         answer = question = tempDom = '';

     }

     return dom;
 }

 function binarySearch(searchArray, searchElement, caseInsensitive) {
     if (typeof searchArray === 'undefined' || searchArray.length <= 0 || typeof searchElement === 'undefined' ||
         searchElement === '') {
         return -1;
     }
     var array = searchArray;
     var key = searchElement;
     var keyArr = [];
     var len = array.length;
     var ub = (len - 1);
     var p = 0;
     var mid = 0;
     var lb = p;

     key = caseInsensitive && key && typeof key == 'string' ? key.toLowerCase() : key;

     function isCaseInsensitive(caseInsensitive, element) {
         return caseInsensitive && element.word && typeof element.word == 'string' ? (element.word).toLowerCase() :
             element.word;
     }
     while (lb <= ub) {
         mid = parseInt(lb + (ub - lb) / 2, 10);

         if (isCaseInsensitive(caseInsensitive, array[mid]).indexOf(key) > -1) {
             keyArr.push(mid);
             if (keyArr.length > len) {
                 return keyArr;
             } else if (array[mid + 1] && isCaseInsensitive(caseInsensitive, array[mid + 1]).indexOf(key) > -1) {
                 for (var i = 1; i < len; i++) {
                     if (array[mid + 1] && isCaseInsensitive(caseInsensitive, array[mid + i]).indexOf(key) == -1) {
                         break;
                     } else {
                         keyArr.push(mid + i);

                     }
                 }
             }
             if (keyArr.length > len) {
                 return keyArr;
             } else if (array[mid - 1] && isCaseInsensitive(caseInsensitive, array[mid - 1]).indexOf(key) > -1) {
                 for (var i = 1; i < len; i++) {

                     if (isCaseInsensitive(caseInsensitive, array[mid - i]).indexOf(key) == -1) {
                         break;
                     } else {
                         keyArr.push(mid - i);
                     }
                 }
             }
             return keyArr;
         } else if (key > isCaseInsensitive(caseInsensitive, array[mid])) {
             lb = mid + 1;
         } else {
             ub = mid - 1;
         }
     }
     return -1;

 };