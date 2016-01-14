
function AutoFill() {
    if ($('#packname').val() == '')
    {
        $('#packname').val(document.forms["fileForm"]["fileToUpload"].value.replace(/^.*[\\\/]/, '').slice(0, -3));
    }
}

function validateForm() {
    var fileToUpload = document.forms["fileForm"]["fileToUpload"].value;
    if (fileToUpload == null || fileToUpload == "") {
        alert("You must choose a file to upload");
        return false;
    }


    var file_name = $('#packname').val();
    if (file_name == null || file_name == "") {
        document.forms["fileForm"]["file_name"].value = fileToUpload.replace(/^.*[\\\/]/, '').slice(0, -3);
    }
    else
    {
        document.forms["fileForm"]["file_name"].value = $('#packname').val();
    }

    
    document.forms["fileForm"]["author"].value = $('#author').val();
    document.forms["fileForm"]["description"].value = $('#description').val();

    return true;
}

loadPackages();

function loadPackages() {
    $.post("/api/pack/load", {
        }, function(data){
            var tableHTML = ""; 

            var message = JSON.parse(data);
	        for (var i = 0; i < message.length; i++) {
                tableHTML = tableHTML + '<tr id=' + message[i].name + '>' 
                + '<td><img src="local/pack/' + message[i].uuid + '.jpg" width="50" height="50" ></td>' 
                + '<td>' + message[i].name + '</td>' 
                + '<td>' + message[i].author + '</td>'
                + '<td>' + message[i].description + '</td>'
                + '<td><span class="glyphicon glyphicon-gift" aria-hidden="true" onclick="window.location.href = \'fileview.html?working_dir=pack/' + message[i].uuid + '&root_dir=local\';"></span></td>'
                + '<td><span class="glyphicon glyphicon-flash" aria-hidden="true" onclick=";"></span></td>'
                + '<td><span class="glyphicon glyphicon-send" aria-hidden="true" onclick="SetPackageID();LoadCluster();$(\'#deploypack\').modal(\'show\');"></span></td>'
                + '<td><span class="glyphicon glyphicon-remove" aria-hidden="true" onclick="RemovePackage(\'' + message[i].name + '\');"></span></td>'
                + '</tr>';
                
            }
            $("#packList tbody > tr").empty();
            $("#packList tbody").append(tableHTML);
        }
    );


}

function RemovePackage(name) {
    $.post("/api/pack/del", { name: name
        }, function(data){ 
            if(data=='success') {
                $('tr[id="'+name+'"]').remove();
            }
        }
    );
}

function DeployPackage(name,id,cluster_name) {
    $.post("/api/pack/deploy", { name: name, id: id, cluster_name: cluster_name
        }, function(data){ 
            
        }
    );
}

function SetPackageID(id) {
    $('#package_id_to_deploy').val(id);
}

function LoadCluster() {
    $.post("/api/clusterlist", { 
        command:""
        }, function(data){ 
            data = JSON.parse(data);
            result = "";
            for(var cluster in data)
            {
                var clusterDisplay = data[cluster]['name'] + '(' + data[cluster]['type'] + ')'
                result += '<li><a href="#" onclick="$(\'#clusterchoice\').text(\'' + clusterDisplay + '\');$(\'#cluster_name_to_deploy\').val(\'' + data[cluster]['name'] + '\');">' + clusterDisplay + '</a></li>' ;
            }
            $('clusterlist').html(result);
            
        }
    );
}

document.getElementById("iconToUpload").onchange = function () {
    document.getElementById("iconpath").value = this.value.replace(/^.*[\\\/]/, '');
};

document.getElementById("fileToUpload").onchange = function () {
    AutoFill();
    document.getElementById("filepath").value = this.value.replace(/^.*[\\\/]/, '');
};

//check-box-list
$(function () {
    $('.list-group.checked-list-box .list-group-item').each(function () {
        // Settings
        var $widget = $(this),
        $checkbox = $('<input type="checkbox" class="hidden" />'),
        color = ($widget.data('color') ? $widget.data('color') : "primary"),
        style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
        settings = {
            on: {
                icon: 'glyphicon glyphicon-check'
            },
        off: {
            icon: 'glyphicon glyphicon-unchecked'
        }
        };

    $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

    // Event Handlers
    $widget.on('click', function () {
        $checkbox.prop('checked', !$checkbox.is(':checked'));
        $checkbox.triggerHandler('change');
        updateDisplay();
    });
    $checkbox.on('change', function () {
        updateDisplay();
    });


    // Actions
    function updateDisplay() {
        var isChecked = $checkbox.is(':checked');

        // Set the button's state
        $widget.data('state', (isChecked) ? "on" : "off");

        // Set the button's icon
        $widget.find('.state-icon')
            .removeClass()
            .addClass('state-icon ' + settings[$widget.data('state')].icon);

        // Update the button's color
        if (isChecked) {
            $widget.addClass(style + color + ' active');
        } else {
            $widget.removeClass(style + color + ' active');
        }
    }

    // Initialization
    function init() {

        if ($widget.data('checked') == true) {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
        }

        updateDisplay();

        // Inject the icon if applicable
        if ($widget.find('.state-icon').length == 0) {
            $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
        }
    }
    init();
    });
});
