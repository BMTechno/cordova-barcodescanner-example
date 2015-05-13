var app = angular.module('app',['ngCordova']);

app.controller('RootCtrl', function($scope, $cordovaBarcodeScanner, $cordovaSocialSharing, $cordovaDevice) {

  /**
  Variables
  */
  $scope.items = [
      {name: 'http://test.com', format: 'QR'},
      {name: '123124124124', format: 'BAR'},
      {name: 'http://voorbeeld.nl', format: 'QR'}
  ];
    
  $scope.continues = 0;
    
  $scope.device = {};
    
  /**
  Define functions
  */
    
  //Delete
  $scope.delete = function(item){
      
    $scope.items.splice($scope.items.indexOf(item), 1);
      
  }

  //Add function, append to list
  add = function(barcodeData){
    
      $scope.items.push({
        name: barcodeData.text,
        format: barcodeData.format 
       });   
      
  }
      
  //Apply functions requiring device ready 
  document.addEventListener("deviceready", function () {

        //Get device props:      
        $scope.device = $cordovaDevice.getDevice();
  
      
        //Scan function
        $scope.scan = function(continues){

            $cordovaBarcodeScanner
              .scan()
              .then(function(barcodeData) {

                //Check scanned data
                if(barcodeData.text == '' || angular.isUndefined(barcodeData.text) ){
                   return false;    
                }

                //Return scanned data.
                alert('Scanned: '+barcodeData.text);

                add(barcodeData);

                //Repeat function if continues
                if(continues){
                    $scope.scan(true);
                }

              }, function(error) {

                alert("Scanning failed: " + error);

              });
        }
    
        //Share scan results
        $scope.share = function(){

            //Define vars
            var message = 'Scan resultaten in CSV format:\n\n-----------------------------------\n';
            var subject = 'Scan resultaten';
            var link = '';
            var file = '';

            //Parse scandata
            message = message + 'item,format\n';
            angular.forEach($scope.items, function(value, key) {
              message = message + value.name + ',' + value.format + '\n'
            });
            message = message + '-----------------------------------';

            //Actual share tirgger
            $cordovaSocialSharing
                .share(message, subject, file, link)
                .then(function(result) {

                  // Success!

                }, function(error) {

                    alert("Share failed: " + error);

                });
         }

  }, false);
    
});
