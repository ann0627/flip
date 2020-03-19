var scrollPos = 0,
    winH = 0,
    winW = 0,
    seriesSwiper,
    procedureSwiper,
    recommentSwiper,
    viewSeries = false,
    viewProcedure = false;

var vm = new Vue({
    el: '#app',
    data: {
        status: {
            slideMenu: false,
            flipGame: false, // if start
            psycholGame: false,
            form: false,
            exchanged: false,
            usableSubmit: false,
            modalFlip: false,
            modalFlipOver: false,
            modalPsycholForm: false,
            modalMethod: false,
            modalPersonalLaw: false,
            modalExchange: false,
            ajaxLoading: false,
            psycholPlayed: false,
            recomment: false,
        },

        flipGame: {
            tab: 0,
            reward: {
                discount: 0,
                coupon: 'asdsads',
            },
            score: 0,
            count: 0,
            duration: 20, // gametime
            reciprocal: 0,
            durationTimer: null,
            waitflip: 500,
            randomArr: [],
            checkedArr: [],
            data: [
                {
                    cardNum: 1,
                    imgUrl: 'card_1.png',
                    active: false,
                },
                {
                    cardNum: 1,
                    imgUrl: 'card_1.png',
                    active: false,
                },
                {
                    cardNum: 2,
                    imgUrl: 'card_2.png',
                    active: false,
                },
                {
                    cardNum: 2,
                    imgUrl: 'card_2.png',
                    active: false,
                },
                {
                    cardNum: 3,
                    imgUrl: 'card_3.png',
                    active: false,
                },
                {
                    cardNum: 3,
                    imgUrl: 'card_3.png',
                    active: false,
                },
                {
                    cardNum: 4,
                    imgUrl: 'card_4.png',
                    active: false,
                },
                {
                    cardNum: 4,
                    imgUrl: 'card_4.png',
                    active: false,
                },
                {
                    cardNum: 5,
                    imgUrl: 'card_5.png',
                    active: false,
                },
                {
                    cardNum: 5,
                    imgUrl: 'card_5.png',
                    active: false,
                },
                {
                    cardNum: 6,
                    imgUrl: 'card_6.png',
                    active: false,
                },
                {
                    cardNum: 6,
                    imgUrl: 'card_6.png',
                    active: false,
                },
            ],
        },
    },

    beforeMount: function() {
        // flip 亂數陣列初始
        var flipLen = this.flipGame.data.length;
        this.flipGame.randomArr = Array.apply(null, { length: flipLen }).map(Function.call, Number);

        // resetFlipGame
        this.resetFlipGame();
    },

    methods: {
        switchStatus: function(which, boolean) {
            this.status[which] = boolean;
        },

        switchMenuSwitch: function() {
            this.status.slideMenu = !this.status.slideMenu;
            mobileFullHeight();
        },

        // Flip Game
        setRandomArr: function() {
            this.flipGame.randomArr = Array.apply(null, { length: 12 }).map(Function.call, Number);
            this.flipGame.randomArr = shuffle(this.flipGame.randomArr);
        },

        // 翻牌
        flipCard: function(item) {
            var that = this;
            if (vm.status.flipGame && !this.flipGame.data[item].active) {
                if (this.flipGame.count < 2) {
                    this.flipGame.data[item].active = true;
                    this.flipGame.checkedArr.push(this.flipGame.data[item]);

                    this.flipGame.count += 1;
                }

                if (this.flipGame.count == 2) {
                    this.switchStatus('flipGame', false);

                    this.flipGame.checkedArr.reduce(function(prev, element) {
                        if (prev.cardNum == element.cardNum) {
                            that.flipGame.score += 1;
                            if (that.flipGame.score == 6) {
                                that.endFlipGame();
                            }
                            that.switchStatus('flipGame', true);
                        } else {
                            var timer = setTimeout(function() {
                                prev.active = false;
                                element.active = false;
                                that.switchStatus('flipGame', true);
                            }, that.flipGame.waitflip);
                        }
                        that.flipGame.checkedArr = [];
                        that.flipGame.count = 0;
                    });
                }
            }
        },

        // counting time
        flipReciprocal: function() {
            var that = this;
            this.flipGame.durationTimer = setInterval(function() {
                that.flipGame.reciprocal -= 1;
                if (that.flipGame.reciprocal < 10) {
                    that.flipGame.reciprocal = '0' + that.flipGame.reciprocal;
                    that.flipGame.reciprocal = that.flipGame.reciprocal;
                }

                if (parseInt(that.flipGame.reciprocal) == 0) {
                    that.endFlipGame();
                }
            }, 1000);
        },

        // get reward
        getFlipGameReword: function(score) {
            var discount = 0;
            var coupon = 'ETUDMAR30';

            if (score <= 2) {
                discount = 30;
            } else if (score > 2 && score <= 5) {
                discount = 50;
                coupon = 'ETUDMAR50';
            } else {
                discount = 80;
                coupon = 'ETUDMAR80';
            }

            this.flipGame.reward.discount = '$' + discount;
            this.flipGame.reward.coupon = coupon;
        },

        // Flip game start , game end
        startFlipGame: function($target) {
            $($target).addClass('off');
            this.switchStatus('flipGame', true);
            this.setRandomArr();
            this.flipReciprocal();
        },

        endFlipGame: function() {
            // Ajax here
            this.getFlipGameReword(this.flipGame.score); // add to ajax response
            this.sendFlipGameResult();
        },

        sendFlipGameResult: function() {
            var that = this;

            this.switchStatus('flipGame', false);
            clearInterval(this.flipGame.durationTimer);
            this.switchStatus('modalFlip', true);
        },

        resetFlipGame: function() {
            this.flipGame.reciprocal = this.flipGame.duration;
            this.flipGame.data.forEach(function(el, i) {
                el.active = false;
            });

            this.flipGame.score = 0;
            this.flipGame.reward.discount = 0;
            this.flipGame.reward.coupon = '';
            this.switchStatus('modalFlip', false);
            this.switchStatus('flipGame', false);
            $('.circle-game').removeClass('off');
        },

        objectDeepCopy: function(obj) {
            return typeof obj === 'object' && obj !== null ? JSON.parse(JSON.stringify(obj)) : false;
        },
    },
});

$(window).on('load', function() {
    setInitData();

    $('body').addClass('loaded');
    if ($('.curtain').length || $('.flip-start .flip').length) {
        vm.flipGame.tab = 1;
    }
});
// 亂數
function shuffle(arr) {
    var i, j, temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// full height
function setInitData() {
    scrollPos = document.documentElement.scrollTop || document.body.scrollTop || 0;
    winW = $(window).outerWidth();
    winH = $(window).outerHeight();
}

// objectDeepCopy //
function objectDeepCopy(obj) {
    return typeof obj === 'object' && obj !== null ? JSON.parse(JSON.stringify(obj)) : false;
}
