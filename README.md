# mspui Search 
- - - -

## Issues to resolve ##

1. Take into consideration the question and answer weightage [Product]
2. Refactor the code and used OOPS and black box approach 
3. Output should be similar to the input JSON with answer's weightage score and question weightage score and sorted in descending order [Higher match score on the top]


## Input ##

1. Remove special character and search only numbers or string [Solved]
2. Similary while performing binary search, make sure search array doesn't contain any special character. [Solved]


## Resoved Issues: ##

1. Binary search returning first match but not occurance of the same word. eg. There is multiple occurance for sim but it returing only first one. [Solved]

2. Binary search not return results for all matches. eg. SIM, Is, Yeah, course [Solved: Sorting was not properly made]

3. Highlighter of the words after sorting [Solved 29Mar/6:30AM]
4. Partial and full text search is not working as we implemented the binary search to match the complete text string [Solved]
5. Relevence score still not full proof. Need to cross check [Product] [Solved 30Mar/01:10AM]
6. Binary search not working with case insensitive words [Algorithm]
7. Show only those answers which contains the search keyword. Rightnow it is showing only first one after overall question & answer's keywords match score. [Solved]
8. Not giving any specific weightage to sequential search keywords. Needs to be done. [Solved]