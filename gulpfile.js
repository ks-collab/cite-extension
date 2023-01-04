const { exec } = require('child_process');
var gulp = require('gulp');

const rebuildProject = (cb) => {
  console.log("Rebuiding project...");
  exec('yarn build', (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log("Project rebuilt!");
    if (cb) cb();
  });
}

function reloadChromeExtensionsTab(cb) {
  exec('chrome-cli list tabs', function (err, stdout) {
    if (err) cb(err);
    var extensionsTabMatches = stdout.match(/\[\d+\] Extensions/);
    if (extensionsTabMatches) {
      console.log("Found Extensions Tab, reloading...");
      var extensionsTabID = extensionsTabMatches[0].replace(/\D/g,'');
      exec('chrome-cli reload -t ' + extensionsTabID, () => {
        console.log("Extensions tab reloaded!");
      })
    }
    else {
      console.log("Extensions tab was not found, opening a new one...");
      exec('chrome-cli open chrome://extensions && chrome-cli reload')
    }
  });
}

gulp.task('watch-chrome', function () {
	var watcher = gulp.watch(['./src/**']);
  console.log("watching chrome")
	watcher.on('change', function() {
    rebuildProject(() => {
      reloadChromeExtensionsTab();
    });
	});
});

gulp.task('watch', function () {
	var watcher = gulp.watch(['./src/**']);
  console.log("watching project changes...")
	watcher.on('change', function() {
    rebuildProject();
	});
});
