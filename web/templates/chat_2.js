let currentUserId = 0;
let currentClickedId = 0;

function SortById(x,y) {
    return ((x.id == y.id) ? 0 : ((x.id > y.id) ? 1 : -1));
}

function whoami(){
        $.ajax({
            url:'/current',
            type:'GET',
            contentType: 'application/json',
            dataType:'json',
            success: function(response){
                //alert(JSON.stringify(response));
                $('#cu_username').html(response['username']);
                let name = response['name']+" "+response['fullname'];
                currentUserId = response['id'];
                $('#cu_name').html(name);
                allusers();
            },
            error: function(response){
                alert(JSON.stringify(response));
            }
        });
    }

    function allusers(){
        $.ajax({
            url:'/users',
            type:'GET',
            contentType: 'application/json',
            dataType:'json',
            success: function(response){
                //alert(JSON.stringify(response));
                var i = 0;
                $.each(response, function(){
                    f = '<div class="chat_list" onclick=loadMessages(' + currentUserId + ',' + response[i].id + ') >\n' +
                        '                  <div class="chat_people">\n' +
                        '                    <div class="chat_ib">\n' +
                        '                      <h5>';
                    f = f + response[i].name + '    ' +response[i].fullname;
                    f = f + '<h5><p>';
                    f = f + response[i].username;
                    f = f + '</p>\n' +
                        '    </div>\n' +
                        '    </div>\n' +
                        '    </div>';
                    i = i + 1;
                    $('#allusers').append(f);
                });
            },
            error: function(response){
                alert(JSON.stringify(response));
            }
        });
    }

    function loadMessages(user_from_id, user_to_id){
        //alert(user_from_id);
        //alert(user_to_id);
        currentClickedId = user_to_id;
        $.ajax({
            url:'/messages/'+user_from_id+"/"+user_to_id,
            type:'GET',
            contentType: 'application/json',
            dataType:'json',
            success: function(response){

                response.sort(SortById);

                $('#sent_messages').empty('');
                i = 0;
                $.each(response, function(){
                    if (response[i].user_from_id == currentUserId) {
                        f = '<div class="outgoing_msg"><div class="sent_msg"><p>';
                        f = f + response[i].content;
                        f = f + '</p><span class="time_date">';
                        f = f + response[i].sent_on;
                        f = f + '</span></div></div>';
                        i = i + 1;
                        $('#sent_messages').append(f);
                    }
                    else {
                        f = '<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p>';
                        f = f + response[i].content;
                        f = f + '</p><span class="time_date">';
                        f = f + response[i].sent_on;
                        f = f + '</span> </div></div>';
                        i = i + 1;
                        $('#sent_messages').append(f);
                    }
                });
            },
            error: function(response){
                alert(JSON.stringify(response));
            }
        });
    }

    function sendMessage(){
        var message = $('#postmessage').val();
        $('#postmessage').val('');

        var data = JSON.stringify({
                "user_from_id": currentUserId,
                "user_to_id": currentClickedId,
                "content": message
            });

        $.ajax({
            url:'/gabriel/messages',
            type:'POST',
            contentType: 'application/json',
            data : data,
            dataType:'json',
            success: function(response){
                loadMessages(currentUserId, currentClickedId);
            },
            error: function(response){
                alert(JSON.stringify(response));
            }
        });
    }