var gulp = require('gulp'); //подключение модулей с помощью функции node js require
    less = require('gulp-less');
    imagemin = require('gulp-imagemin');
    useref = require('gulp-useref');
    uglify = require('gulp-uglify');
    cssnano = require('gulp-cssnano');
    gulpIf = require('gulp-if');


gulp.task('less', function () { // Создаем таск Less

    return gulp.src('app/less/*.less') // Берем источник
        .pipe(less()) //Преобразуем Less в CSS посредством gulp-less
        .pipe(gulp.dest('app/css')) //Выгружаем результата в папку app/css
});

gulp.task('watch', function () {

    gulp.watch('app/less/*.less', gulp.parallel('less'));

});

gulp.task('images', function () {//Функция дял обработки картинок.
    return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')// .+(png|jpg|jpeg|gif|svg) - комплексный шаблон для нескольких типов файлов, разделенных вертикальной чертой.
        .pipe(imagemin([//плагин для оптимизации изображений
            imagemin.gifsicle({ interlaced: true }),//gifsicle - Сжатие GIF изображений. В опцях: создавать чересстрочное гиф-изображение.
            imagemin.mozjpeg({ quality: 75, progressive: true }),//mozjpeg - сжатие изображений JPEG. В опции: 1)Качество сжатия в диапазоне 0 до 100 2)создает базовый файл JPEG. true установлено по умолчанию
            imagemin.optipng({ optimizationLevel: 5 }),//optipng - Сжатие изображений PNG. 1) Опции: уровень оптимизации между 0 и 7.
            imagemin.svgo({//svgo - Сжатие изображений SVG. Переданные опции означают следующее:
                plugins: [
                    { removeViewBox: true },// удаляет атрибут viewBox, когда это возможно
                    { cleanupIDs: false }//удаляет неиспользуемые и минимизирует использованные идентификаторы
                ]
            })
        ]))
        .pipe(gulp.dest('dist/images'))// Выгружаем результат в dist/images
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())// плагин gulp-useref автоматически объединяет скрипты между комментариев(которые в html) в один файл и помещает весь код в js/main.min.js.
        .pipe(gulpIf('*.js', uglify()))//uglify() миниирует js
        .pipe(gulpIf('*.css', cssnano()))// cssnano - для минификации css
        // чтобы uglify() запускался только для JS файлов и не трогал css, используем gulp-if.
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('less', 'images', 'useref'));


