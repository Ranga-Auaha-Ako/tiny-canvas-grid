﻿/**
 *	tiny-bs-grid https://github.com/jeffhehe/tiny-bs-grid
 *  Author: Jeff Wang
 *  Date: March 29, 2019
 */

(function () {
  tinymce.PluginManager.add('bootstrap3grid', bootstrap3GridPlugin);

  function bootstrap3GridPlugin(editor, url) {
    editor.contentCSS.push(url + '/bootstrapgrid-style.css');

    editor.addButton('bootstrap3grid', {
      type: 'button',
      text: 'BS3 Grid',
      tooltip: 'Bootstrap3 Grid System',
      stateSelector: 'div.row',
      cmd: 'tinymce_bs3_grid',
    });

    editor.addCommand('tinymce_bs3_grid', function () {
      var dialogueTitle = 'Insert Bootstrap3 Grids';
      var columnValue = '12';
      var screenSize = 'md';
      var node = editor.selection.getNode();
      var parentDOMS = jQuery(node).parents('div.row');
      var editMode = parentDOMS.length > 0;
      if (editMode) {
        var parentRow = parentDOMS[0];
        var oldGrids = jQuery(parentRow).children('div');
        var oldGridNumber = oldGrids.length;
        var oldGridContents = []; 
        if (oldGridNumber > 0) {
          columnValue='';
          for (i = 0; i < oldGridNumber; i++) {
            var gridClasses = jQuery(oldGrids[i]).attr('class').split(/\s+/);
            var gridContent = jQuery(oldGrids[i]).html();
            oldGridContents.push(gridContent);
            for (j = 0; j < gridClasses.length; j++) {
              if (gridClasses[j].match(/col-/)) {
                //only need to check first column for targe screen size
                if(j==0){
                  if (gridClasses[0].indexOf('col-lg') > -1) {
                    screenSize = 'lg';
                  } else if (gridClasses[0].indexOf('col-sm') > -1) {
                    screenSize = 'sm';
                  } else if (gridClasses[0].indexOf('col-xs') > -1) {
                    screenSize = 'xs';
                  }
                }
                var lastDashPos = gridClasses[j].lastIndexOf('-');
                var widthNumb = gridClasses[j].substr(lastDashPos + 1);
                columnValue += widthNumb;
              }
            }
          }
        }
        dialogueTitle = 'Update Bootstrap3 Grids';
      }

      editor.windowManager.open({
        title: dialogueTitle,
        width: 450,
        height: 150,
        body: [{
            type: 'listbox',
            name: 'size',
            label: 'Target Screen',
            values: [
              {
                text: 'Large - laptops & desktops',
                value: 'lg'
              },
              {
                text: 'Medium - small laptops',
                value: 'md'
              },
              {
                text: 'Small - tablets',
                value: 'sm'
              },
              {
                text: 'Extra Small - phones',
                value: 'xs'
              },
            ],
            value: screenSize
          },
          {
            type: 'listbox',
            name: 'grid',
            label: 'Grid',
            values: [{
                text: '1 Column',
                value: '12'
              },
              {
                text: '2 Columns (1:1)',
                value: '66'
              },
              {
                text: '2 Columns (2:1)',
                value: '84'
              },
              {
                text: '2 Columns (3:1)',
                value: '93'
              },
              {
                text: '2 Columns (1:2)',
                value: '48'
              },
              {
                text: '2 Columns (1:3)',
                value: '39'
              },
              {
                text: '3 Columns (1:1:1)',
                value: '444'
              },
              {
                text: '3 Columns (2:1:1)',
                value: '633'
              },
              {
                text: '3 Columns (1:2:1)',
                value: '363'
              },
              {
                text: '3 Columns (1:1:2)',
                value: '336'
              },
              {
                text: '4 Columns (1:1:1:1)',
                value: '3333'
              }
            ],
            value: columnValue
          },
          {
            type: 'checkbox',
            name: 'leadingBreak',
            label: 'Add a Leading Line Break'
          }
        ],
        onsubmit: function (e) {
          var leadingHtml = '';
          var htmlContents = '';
          var endingHtml = '<p></p>';
          if (e.data.leadingBreak == true) {
            leadingHtml = '<p></p>';
          };
          var generateHtmlContents = function (newGridNumber, gridWidthValues) {
            if (!editMode) {
              // create new grids 
              for (var n = 0; n < newGridNumber; n++) {
                htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[n] + '"><p>&nbsp;&nbsp;Column ' + (n + 1) + ' (' + Math.round(gridWidthValues[n] / 12 * 100) + '% width)</p><p></p></div>';
              }
            } else {
              // update existing grids
              if (oldGridNumber > 0 && oldGridNumber < newGridNumber) {
                // if the number of new grids is more than the number of old grids
                for (var k = 0; k < oldGridNumber; k++) {
                  htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[k] + '">' + oldGridContents.shift() + '</div>';
                }
                // create empity girds
                for (var m = oldGridNumber; m < newGridNumber; m++) {
                  htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[m] + '"><p>&nbsp;&nbsp;Column ' + (m + 1) + ' (' + Math.round(gridWidthValues[m] / 12 * 100) + '% width)</p><p></p></div>';
                }
              } else if (oldGridNumber >= newGridNumber) {
                // if the number of new grids is less than the number of old grids
                for (var k = 0; k < newGridNumber; k++) {
                  htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[k] + '">' + oldGridContents.shift() + '</div>';
                }
                // create a new container for all remaining contents below the row
                if (oldGridNumber > newGridNumber) {
                  endingHtml = '<p></p><div>' + oldGridContents.join('<p></p>') + '</div><p></p>';
                }
              }
            }
          };
          switch (e.data.grid) {
            case '12':
              generateHtmlContents(1, [12]);
              break;
            case '66':
              generateHtmlContents(2, [6, 6]);
              break;
            case '84':
              generateHtmlContents(2, [8, 4]);
              break;
            case '93':
              generateHtmlContents(2, [9, 3]);
              break;
            case '48':
              generateHtmlContents(2, [4, 8]);
              break;
            case '39':
              generateHtmlContents(2, [3, 9]);
              break;
            case '444':
              generateHtmlContents(3, [4, 4, 4]);
              break;
            case '633':
              generateHtmlContents(3, [6, 3, 3]);
              break;
            case '363':
              generateHtmlContents(3, [3, 6, 3]);
              break;
            case '336':
              generateHtmlContents(3, [3, 3, 6]);
              break;
            case '3333':
              generateHtmlContents(4, [3, 3, 3, 3]);
              break;
          }
          if (editMode) {
            jQuery(parentDOMS).replaceWith(leadingHtml + '<div class="row">' + htmlContents + '</div>' + endingHtml);
          } else {
            editor.insertContent(leadingHtml + '<div class="row">' + htmlContents + '</div>' + endingHtml);
          }
        }
      });
    });
  }
})();