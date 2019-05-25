<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-form-select :options="lvModelTypes" style="margin-bottom: 20px" v-model="currentType"/>
        <div v-if="isLotkaVolterra || isLotkaVolterraQuadratic">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(prey, 0, 1000)"
                                  aria-describedby="input-msg"
                                  placeholder="Prey"
                                  type="number"
                                  v-model.number="prey"></b-form-input>
                    <b-form-invalid-feedback id="input-msg">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(predator, 0, 1000)"
                                  aria-describedby="input-msg-2"
                                  placeholder="Predator"
                                  type="number"
                                  v-model.number="predator"></b-form-input>
                    <b-form-invalid-feedback id="input-msg-2">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Prey birth rate (Alpha)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterra.a, 0, 30)"
                                  aria-describedby="input-msg-3"
                                  max="100.00" min="0.00"
                                  placeholder="Alpha"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.a"></b-form-input>
                    <b-form-invalid-feedback id="input-msg-3">
                        {{areaMsg(0, 200)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Impact of predation (Gamma 1)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterra.g1, 0, 1000)" aria-describedby="input-msg-4" max="1000.00" min="0.00"
                                  placeholder="Gamma 1"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.g1"></b-form-input>
                    <b-form-invalid-feedback id="input-msg-4">
                        {{areaMsg(0, 200)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator Death rate (Beta)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterra.b, 0, 1000)" aria-describedby="input-msg-5" max="1000.00" min="0.00"
                                  placeholder="Beta"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.b"></b-form-input>
                    <b-form-invalid-feedback id="input-msg-5">
                        {{areaMsg(0, 200)}}
                    </b-form-invalid-feedback>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Growth in predator (Gamma 2)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterra.g2, 0, 1000)" aria-describedby="input-msg-6" max="1000.00" min="0.00"
                                  placeholder="Gamma 2"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.g2">
                        <b-form-invalid-feedback id="input-msg-6">
                            {{areaMsg(0, 200)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(time, 0, 1000)" aria-describedby="input-msg-7" max="1000.00" min="0.00"
                                  placeholder="Time"
                                  step="0.01"
                                  type="number"
                                  v-model.number="time">
                        <b-form-invalid-feedback id="input-msg-7">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(timeStep, 0, time)" aria-describedby="input-msg-8" max="1000.00"
                                  min="0.00"
                                  placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep">
                        <b-form-invalid-feedback id="input-msg-8">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraFiniteCapacity">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(prey, 0, 1000)"
                                  aria-describedby="input-msg-9"
                                  placeholder="Prey"
                                  type="number"
                                  v-model.number="prey">
                        <b-form-invalid-feedback id="input-msg-9">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(predator, 0, 1000)" aria-describedby="input-msg-10"
                                  placeholder="Predator"
                                  type="number"
                                  v-model.number="predator">
                        <b-form-invalid-feedback id="input-msg-10">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Prey birth rate (Alpha)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterraFiniteCapacity.a, 0, 1000)" aria-describedby="input-msg-11" max="1000.00" min="0.00"
                                  placeholder="Alpha"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.a"/>
                    <b-form-invalid-feedback id="input-msg-11">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Impact of predation (Gamma 1)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterraFiniteCapacity.g1, 0, 1000)" aria-describedby="input-msg-12" max="1000.00" min="0.00"
                                  placeholder="Gamma 1"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.g1">
                        <b-form-invalid-feedback id="input-msg-12">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator Death rate (Beta)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterraFiniteCapacity.b, 0, 1000)" aria-describedby="input-msg-13" max="1000.00" min="0.00"
                                  placeholder="Beta"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.b">
                        <b-form-invalid-feedback id="input-msg-13">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Growth in predator (Gamma 2)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterraFiniteCapacity.g2, 0, 1000)" aria-describedby="input-msg-14" max="1000.00" min="0.00"
                                  placeholder="Gamma 2"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.g2">
                        <b-form-invalid-feedback id="input-msg-14">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="4">
                    <label>Predator capacity (K)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterraFiniteCapacity.K, 0, 1000)" aria-describedby="input-msg-15" max="1000.00"
                                  min="0.00"
                                  step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.K">
                        <b-form-invalid-feedback id="input-msg-15">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(time, 0, 1000)" aria-describedby="input-msg-16" max="1000.00" min="0.00"
                                  placeholder="Time"
                                  step="0.01"
                                  type="number"
                                  v-model.number="time">
                        <b-form-invalid-feedback id="input-msg-16">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(timeStep, 0, time)" aria-describedby="input-msg-17" max="1000.00"
                                  min="0.00"
                                  placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep">
                        <b-form-invalid-feedback id="input-msg-17">
                            {{areaMsg(0, time)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraContTime">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(prey, 0, 1000)" aria-describedby="input-msg-18"
                                  placeholder="Prey"
                                  type="number"
                                  v-model.number="prey">
                        <b-form-invalid-feedback id="input-msg-18">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(predator, 0, 1000)"
                                  aria-describedby="input-msg-19"
                                  placeholder="Predator"
                                  type="number"
                                  v-model.number="predator">
                        <b-form-invalid-feedback id="input-msg-19">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(r)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input :state="checkRange(experimentLotkaVolterraContTime.r, 0, 1000)"
                                  aria-describedby="input-msg-20"
                                  max="1000.00"
                                  min="0.00" step="0.01" type="number"
                                  v-model.number="experimentLotkaVolterraContTime.r">
                        <b-form-invalid-feedback id="input-msg-20">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(k)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContTime.k, 0, 1000)"
                                  aria-describedby="input-msg-21"
                                  v-model.number="experimentLotkaVolterraContTime.k">
                        <b-form-invalid-feedback id="input-msg-21">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(a)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContTime.a, 0, 1000)"
                                  aria-describedby="input-msg-22"
                                  v-model.number="experimentLotkaVolterraContTime.a"/>
                    <b-form-invalid-feedback id="input-msg-22">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(c)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContTime.c, 0, 1000)"
                                  aria-describedby="input-msg-23"
                                  v-model.number="experimentLotkaVolterraContTime.c"/>
                    <b-form-invalid-feedback id="input-msg-23">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(b)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContTime.b, 0, 1000)"
                                  aria-describedby="input-msg-24"
                                  v-model.number="experimentLotkaVolterraContTime.b"/>
                    <b-form-invalid-feedback id="input-msg-24">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(d)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContTime.d, 0, 1000)"
                                  aria-describedby="input-msg-25"
                                  v-model.number="experimentLotkaVolterraContTime.d"/>
                    <b-form-invalid-feedback id="input-msg-25">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  :state="checkRange(time, 0, 1000)"
                                  aria-describedby="input-msg-26"
                                  v-model.number="time">
                        <b-form-invalid-feedback id="input-msg-26">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  :state="checkRange(timeStep, 0, time)"
                                  aria-describedby="input-msg-27"
                                  v-model.number="timeStep">
                        <b-form-invalid-feedback id="input-msg-27">
                            {{areaMsg(0, time)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isRosenzweigMacArthur">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  :state="checkRange(prey, 0, 1000)"
                                  aria-describedby="input-msg-28"
                                  v-model.number="prey">
                        <b-form-invalid-feedback id="input-msg-28">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"
                                  :state="checkRange(predator, 0, 1000)"
                                  aria-describedby="input-msg-29">
                        <b-form-invalid-feedback id="input-msg-29">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(k)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  :state="checkRange(experimentRosenzweigMacArthur.k, 0, 1000)"
                                  aria-describedby="input-msg-30"
                                  v-model.number="experimentRosenzweigMacArthur.k">
                        <b-form-invalid-feedback id="input-msg-30">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(m)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentRosenzweigMacArthur.m, 0, 1000)"
                                  aria-describedby="input-msg-31"
                                  v-model.number="experimentRosenzweigMacArthur.m">
                        <b-form-invalid-feedback id="input-msg-31">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(c)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentRosenzweigMacArthur.c, 0, 1000)"
                                  aria-describedby="input-msg-32"
                                  v-model.number="experimentRosenzweigMacArthur.c"/>
                    <b-form-invalid-feedback id="input-msg-32">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  :state="checkRange(time, 0, 1000)"
                                  aria-describedby="input-msg-33"
                                  v-model.number="time">
                        <b-form-invalid-feedback id="input-msg-33">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  :state="checkRange(timeStep, 0, time)"
                                  aria-describedby="input-msg-34"
                                  v-model.number="timeStep">
                        <b-form-invalid-feedback id="input-msg-34">
                            {{areaMsg(0, time)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraContiniousTimeAlleeEffect">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="prey"
                                  :state="checkRange(prey, 0, 1000)"
                                  aria-describedby="input-msg-35">
                        <b-form-invalid-feedback id="input-msg-35">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"
                                  :state="checkRange(predator, 0, 1000)"
                                  aria-describedby="input-msg-36"
                    >
                        <b-form-invalid-feedback id="input-msg-36">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(r)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  :state="checkRange(experimentLotkaVolterraContiniousTimeAlleeEffect.r, 0, 1000)"
                                  aria-describedby="input-msg-37"
                                  v-model.number="experimentLotkaVolterraContiniousTimeAlleeEffect.r">
                        <b-form-invalid-feedback id="input-msg-37">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(a)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContiniousTimeAlleeEffect.a, 0, 1000)"
                                  aria-describedby="input-msg-38"
                                  v-model.number="experimentLotkaVolterraContiniousTimeAlleeEffect.a">
                        <b-form-invalid-feedback id="input-msg-38">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(b)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  :state="checkRange(experimentLotkaVolterraContiniousTimeAlleeEffect.b, 0, 1000)"
                                  aria-describedby="input-msg-39"
                                  v-model.number="experimentLotkaVolterraContiniousTimeAlleeEffect.b"/>
                    <b-form-invalid-feedback id="input-msg-39">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  :state="checkRange(time, 0, 1000)"
                                  aria-describedby="input-msg-40"
                                  v-model.number="time">
                        <b-form-invalid-feedback id="input-msg-40">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  :state="checkRange(timeStep, 0, time)"
                                  aria-describedby="input-msg-41"
                                  type="number"
                                  v-model.number="timeStep">
                        <b-form-invalid-feedback id="input-msg-41">
                            {{areaMsg(0, 1000)}}
                        </b-form-invalid-feedback>
                    </b-form-input>
                </b-col>
            </b-row>
        </div>
        <div style="margin-top: 10px">
            <b-button v-on:click="calculateLotkaVolterra" variant="outline-primary">
                <i class="fas fa-calculator"></i>
                Calculate
            </b-button>
            <b-button v-on:click="compare" variant="outline-info">
                <i class="fas fa-greater-than-equal"></i>
                Compare
            </b-button>
            <b-button v-on:click="addToChart" variant="outline-info">
                <i class="fas fa-greater-than"></i>
            </b-button>
            <b-button v-on:click="removeChart" variant="outline-danger">
                <i class="far fa-window-close"></i>
            </b-button>
            <br>
            <b-button v-on:click="saveData" variant="outline-success">
                <i class="fas fa-file-excel"></i>
                Save Data
            </b-button>
            <b-button v-on:click="savePdf" variant="outline-danger">
                <i class="far fa-file-pdf"/>
                Save Pdf
            </b-button>
        </div>
        <vs-divider/>
        <div>
            <b-button v-b-toggle.formula variant="outline-info">Show formula
            </b-button>
            <b-collapse class="mt-2" id="formula">
                <b-card>
                    <katex-element :expression='currentModel.getFormula()'
                                   max-size="\rule{10px}{10px}"/>
                </b-card>
            </b-collapse>
        </div>
        <vs-divider/>
        <div style="margin-top: 30px">
            <b-button v-b-modal.modal-test-compare variant="outline-primary">
                <i class="fas fa-rocket"></i>Start tests
            </b-button>
        </div>
        <b-modal id="modal-test-compare" scrollable size="xl" title="parameter run test">
            <l-v-comparison-test-modal :model="currentModel"
                                       :params="currentExperimentParams"
                                       :predator="predator"
                                       :prey="prey"
                                       :time="time"
                                       :time-step="timeStep"
            />
        </b-modal>
    </div>
</template>

<script>
    import {
        BasicLotkaVolterra,
        LotkaVolterraContiniousTimeAlleeEffect,
        LotkaVolterraContiniousTimeFiniteCapacity,
        LotkaVolterraFiniteCapacity,
        RosenzweigMacArthur,
    } from "../../assets/lotkaVolterra";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";
    import LVComparisonTestModal from './modals/LVComparisonTestModal'
    import {setNumber} from "../../assets/pdfUtils";

    export default {
        name: "LotkaVolterraControlPanel",
        components: {
            LVComparisonTestModal
        },
        data() {
            return {
                lvModelTypes: [
                    'Lotka-Volterra',
                    'Lotka-Volterra with continuous time',
                    'Rosenzweig and MacArthur model',
                    'Lotka-Volterra finite capacity',
                    'Lotka-Volterra continuous-time with Allee Effect'
                ],
                currentType: 'Lotka-Volterra',
                experimentLotkaVolterra: {
                    prey: 10,
                    predator: 10,
                    a: 0.6,
                    g1: 0.014,
                    b: 0.7,
                    g2: 0.014,
                },
                experimentLotkaVolterraFiniteCapacity: {
                    prey: 20,
                    predator: 3,
                    a: 0.9,
                    g1: 0.3,
                    b: 0.6,
                    g2: 0.06,
                    K: 5
                },
                time: 10,
                timeStep: 0.1,
                prey: 10,
                predator: 10,
                experimentLotkaVolterraContTime: {
                    prey: 10,
                    predator: 10,
                    r: 1.6,
                    k: 125,
                    a: 3.2,
                    c: 50,
                    b: 0.6,
                    d: 0.56,
                },
                experimentRosenzweigMacArthur: {
                    prey: 10,
                    predator: 10,
                    k: 2,
                    m: 3,
                    c: 4
                },
                experimentLotkaVolterraContiniousTimeAlleeEffect: {
                    prey: 10,
                    predator: 10,
                    r: 0.3,
                    a: 0.06,
                    b: 0.02
                },
                compareFlag: false,
                dataPrey: [],
                compareDataPrey: [],
                dataPredator: [],
                compareDataPredator: [],
                dataBehave: [],
                dataBifurcation: [],
                series: [],
                seriesCompare: [],
                seriesBehave: [],
                seriesBifurcation: [],
                selectParameter: ['alpha', 'beta', 'gamma1', 'gamma2'],
                bifurcationParam: 'alpha',
                bifurcationStartValue: 0.0001,
                bifurcationMaxValue: 5,
                bifurcationStep: 0.001,
                isLotkaVolterra: false,
                isLotkaVolterraContTime: false,
                isRosenzweigMacArthur: false,
                isLotkaVolterraFiniteCapacity: false,
                isLotkaVolterraQuadratic: false,
                isLotkaVolterraContiniousTimeAlleeEffect: false,

                isPreyBifurcation: true,

                currentModel: null,
                currentExperimentParams: null,
            }
        },
        watch: {
            currentType: function (data) {
                this.isRosenzweigMacArthur =
                    this.isLotkaVolterra =
                        this.isLotkaVolterraContTime =
                            this.isLotkaVolterraFiniteCapacity =
                                this.isLotkaVolterraQuadratic =
                                    this.isLotkaVolterraContiniousTimeAlleeEffect = false;

                this.assignParams(data);
            },

        },
        mounted() {
            this.isLotkaVolterra = true;
            this.currentModel = new BasicLotkaVolterra(
                this.experimentLotkaVolterra.a,
                this.experimentLotkaVolterra.g1,
                this.experimentLotkaVolterra.b,
                this.experimentLotkaVolterra.g2
            );
            this.currentExperimentParams = this.experimentLotkaVolterra;
        },
        methods: {
            addToChart() {
                this.$emit('addToChart', [...this.series]);
            },
            removeChart() {
                this.$emit('removeChart', true);
            },
            checkRange(value, min, max) {
                return value >= min && value <= max;
            },
            areaMsg(min, max) {
                return `Value should between ${min} and ${max}`
            },
            assignParams(data) {
                this.isLotkaVolterra =
                    this.isLotkaVolterraContTime =
                        this.isRosenzweigMacArthur =
                            this.isLotkaVolterraFiniteCapacity =
                                this.isLotkaVolterraContiniousTimeAlleeEffect = false;
                if (data === this.lvModelTypes[0]) {
                    this.isLotkaVolterra = true;
                    this.currentModel = new BasicLotkaVolterra(
                        this.experimentLotkaVolterra.a,
                        this.experimentLotkaVolterra.g1,
                        this.experimentLotkaVolterra.b,
                        this.experimentLotkaVolterra.g2
                    );
                    this.currentExperimentParams = this.experimentLotkaVolterra;
                }
                if (data === this.lvModelTypes[1]) {
                    this.isLotkaVolterraContTime = true;
                    this.currentModel = new LotkaVolterraContiniousTimeFiniteCapacity(
                        this.experimentLotkaVolterraContTime.r,
                        this.experimentLotkaVolterraContTime.k,
                        this.experimentLotkaVolterraContTime.a,
                        this.experimentLotkaVolterraContTime.c,
                        this.experimentLotkaVolterraContTime.b,
                        this.experimentLotkaVolterraContTime.d);
                    this.currentExperimentParams = this.experimentLotkaVolterraContTime;
                }
                if (data === this.lvModelTypes[2]) {
                    this.isRosenzweigMacArthur = true;
                    this.currentModel = new RosenzweigMacArthur(
                        this.experimentRosenzweigMacArthur.k,
                        this.experimentRosenzweigMacArthur.m,
                        this.experimentRosenzweigMacArthur.c);
                    this.currentExperimentParams = this.experimentRosenzweigMacArthur;
                }
                if (data === this.lvModelTypes[3]) {
                    this.isLotkaVolterraFiniteCapacity = true;
                    this.currentModel = new LotkaVolterraFiniteCapacity(
                        this.experimentLotkaVolterraFiniteCapacity.a,
                        this.experimentLotkaVolterraFiniteCapacity.g1,
                        this.experimentLotkaVolterraFiniteCapacity.b,
                        this.experimentLotkaVolterraFiniteCapacity.g2,
                        this.experimentLotkaVolterraFiniteCapacity.K);
                    this.currentExperimentParams = this.experimentLotkaVolterraFiniteCapacity;
                }
                if (data === this.lvModelTypes[4]) {
                    this.isLotkaVolterraContiniousTimeAlleeEffect = true;
                    this.currentModel = new LotkaVolterraContiniousTimeAlleeEffect(
                        this.experimentLotkaVolterraContiniousTimeAlleeEffect.r,
                        this.experimentLotkaVolterraContiniousTimeAlleeEffect.a,
                        this.experimentLotkaVolterraContiniousTimeAlleeEffect.b);
                    this.currentExperimentParams = this.experimentLotkaVolterraContiniousTimeAlleeEffect;
                }
                this.$emit('model', {
                    model: this.currentModel,
                    predator: this.predator,
                    prey: this.prey
                })
            },
            calculateLotkaVolterra() {
                this.assignParams(this.currentType);
                this.series = [];
                this.seriesBehave = [];
                this.calculateForTime(this.time).then(result => {
                    this.dataPrey = result.prey;
                    this.dataPredator = result.predator;
                    this.dataBehave = result.behave;
                    this.series = [
                        {
                            name: "Prey population",
                            data: [...this.dataPrey]
                        },
                        {
                            name: "Predator population",
                            data: [...this.dataPredator]
                        }
                    ];
                    this.$emit('series', {
                        series: this.series,
                        params: this.experimentLotkaVolterra
                    });
                    this.$emit('modelType', this.currentType);
                    let eq = this.currentModel.getEquilibrium();
                    this.seriesBehave = [
                        {
                            name: "Behaviour",
                            type: 'line',
                            data: this.dataBehave
                        },
                        {
                            name: "Equilibrium Points",
                            type: 'line',
                            data: eq
                        }
                    ];
                    this.$emit('behaviour', this.seriesBehave);
                })
            },
            calculateForTime(t) {
                let that = this;
                return new Promise(resolve => {
                    let dataPrey = [];
                    let dataPredator = [];
                    let dataBehave = [];

                    let x = that.prey;
                    let y = that.predator;

                    dataPrey.push([0, x]);
                    dataPredator.push([0, y]);
                    dataBehave.push([y, x]);

                    for (let i = that.timeStep; i < t; i += that.timeStep) {
                        let res = that.currentModel.calculateModel(x, y);
                        x += that.timeStep * res.prey;
                        y += that.timeStep * res.predator;

                        if (x <= 0 || y <= 0) {
                            break;
                        }

                        dataPrey.push([i, setNumber(x)]);
                        dataPredator.push([i, setNumber(y)]);
                        dataBehave.push([setNumber(x), setNumber(y)])
                    }
                    resolve({prey: dataPrey, predator: dataPredator, behave: dataBehave})
                })
            },
            saveData() {
                var wb = createWorkbook();
                // add data prey
                var data = Array.from(this.dataPrey);
                data.splice(0, 0, ["prey amount", "time"]);
                wb = createWorkSheet(wb, data, "prey");
                // add dataI
                data = Array.from(this.dataPredator);
                data.splice(0, 0, ["predator amount", "time"]);
                wb = createWorkSheet(wb, data, "predator");
                // save
                saveWorkbook("test", wb);
            },
            compare() {
                this.compareDataPrey = Array.from(this.dataPrey);
                this.compareDataPredator = Array.from(this.dataPredator);
                this.seriesCompare = [
                    {
                        name: "Prey population",
                        data: this.compareDataPrey
                    },
                    {
                        name: "Predator population",
                        data: this.compareDataPredator
                    }
                ];
                var curParams = this.currentModel;
                this.$emit('compare', {
                    series: this.seriesCompare,
                    params: Object.assign({}, curParams)
                });
            },
            savePdf() {
                this.$emit('savePdf', true)
            }
        }
    }
</script>

<style scoped>
    label {
        font-family: 'Karla', sans-serif;
        font-size: medium;
    }

    .row {
        margin-bottom: 10px;
    }

    button {
        margin: 5px;
    }

</style>