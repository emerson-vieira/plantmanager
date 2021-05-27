import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { Header } from "../components/Header";
import { Load } from "../components/Load";
import { EnviromentButton } from "../components/EnviromentButton";
import { PLantCardPrimary } from "../components/PLantCardPrimary";

import { PlantProps } from "../libs/storage";
import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnviromentProps {
    key: string;
    title: string;
}

export function PlantSelect(){
    const { navigate } = useNavigation();
    const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [enviromentSelected, setEnviromentSelected] = useState("all");
    const [loadind, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);


    useEffect(() => {
        async function fetchEnviroment() {
            const { data } = await api.get("plants_environments?_sort=title&_order=asc");
            setEnviroments([
                {key: "all", title: "todos"},
                ...data
            ]);
        }
        fetchEnviroment();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, []);

    async function fetchPlants() {
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
        if(!data)
            return setLoading(true);
        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        }else {
            setPlants(data);
            setFilteredPlants(data);
        }
        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number){
        if(distance < 1) return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    function handleEnviromentSelected(enviroment: string){
        setEnviromentSelected(enviroment);

        if(enviroment === "all")
            return setFilteredPlants(plants);

        const filtered = plants.filter(plant => plant.environments.includes(enviroment));
        setFilteredPlants(filtered);
    }

    function handlePlantSelect(plant: PlantProps){
        navigate("PlantSave", { plant });
    }

    if(loadind)
        return <Load />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
            </View>
            <View>
                <FlatList 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                    data={enviroments}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                />
            </View>
            <View style={styles.plants}>
                <FlatList
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}
                    data={filteredPlants}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <PLantCardPrimary 
                            data={ item }
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={
                        loadingMore 
                            ? <ActivityIndicator color={colors.green}/>
                            : <></>
                    }
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.text,
        lineHeight: 20,     
    },
    enviromentList: {
        height: 40,
        justifyContent: "center",
        paddingBottom: 5,
        paddingHorizontal: 32,
        marginVertical: 32,
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center"
    },
    contentContainerStyle: {
        
    }
});
