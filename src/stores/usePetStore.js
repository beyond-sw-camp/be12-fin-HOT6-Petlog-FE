import { defineStore } from "pinia";
import axios from "axios";

export const usePetStore = defineStore("pet", {
  state: () => ({
    petDetail: null,
    userAnswers: [],
    petList: [],
  }),

  actions: {
    async fetchPetById(petId) {
      try {
        const response = await axios.get(`/api/pet/${petId}`);
        this.petDetail = response.data;
        return response.data; // ✅ 이걸 반드시 추가해야 함
      } catch (error) {
        console.error("반려동물 정보를 불러오는 데 실패:", error);
        throw error;
      }
    },
    async updatePet(petId, petData) {
      try {
        const formData = petData;

        console.log("[🔍 FormData 확인]");
        for (const pair of formData.entries()) {
          if (pair[0] === "pet") {
            pair[1].text().then((text) => console.log(`${pair[0]}:`, text));
          } else {
            console.log(`${pair[0]}:`, pair[1]);
          }
        }

        await axios.post(`/api/pet/${petId}/update`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("반려동물 정보 수정 실패:", error);
        throw error;
      }
    },

    async createPet(petData, profileImageFile) {
      try {
        const formData = new FormData();
        formData.append("pet", new Blob([JSON.stringify(petData)], { type: "application/json" }));
        if (profileImageFile) {
          formData.append("profileImage", profileImageFile);
        }

        await axios.post("/api/pet/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("카드 생성 실패:", error);
        throw error;
      }
    },

    async deletePet(petId) {
      try {
        await axios.delete(`/api/pet/${petId}`);
      } catch (error) {
        console.error("반려동물 삭제 실패:", error);
        throw error;
      }
    },

    async fetchPetList() {
      try {
        const response = await axios.get(`/api/pet/list`);
        this.petList = response.data;
        return response.data;
      } catch (error) {
        console.error("반려동물 목록 불러오기 실패:", error);
        throw error;
      }
    },

    async fetchAnswersByUser(userId) {
      try {
        const response = await axios.get(`/api/answer/list/user/${userId}`);
        this.userAnswers = response.data;
      } catch (error) {
        console.error("답변 목록 불러오기 실패:", error);
        throw error;
      }
    },
  },
});
